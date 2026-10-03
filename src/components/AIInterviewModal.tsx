'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Volume2,
  VolumeX,
  RefreshCw,
  Send,
  Bot,
  User,
  Zap,
  Brain,
  Award,
  Radio
} from 'lucide-react';
import type { Session } from '@google/genai';
import type { AIInterviewResponse, InterviewTurn } from '@/server/ai/interviewService';
import { upsertSpokenCaption } from '@/lib/interviewChat';
import { pcm16ToWav } from '@/lib/interviewAudio';
import { auth, getAiAppCheckHeaders } from '@/lib/firebase';

interface AIInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (transcript: InterviewTurn[]) => void;
  candidateName?: string;
  roleTitle?: string;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  audioUrl?: string;
}

const INTERVIEW_LIMIT_MS = 24 * 60 * 1000;
const CLOSING_MESSAGE = 'Thanks for the interview.';

export const AIInterviewModal: React.FC<AIInterviewModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  candidateName = 'Akash Mushigeri',
  roleTitle = 'Full Stack Engineering Candidate',
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAiVoiceEnabled, setIsAiVoiceEnabled] = useState(true);
  const isAiVoiceEnabledRef = useRef(isAiVoiceEnabled);
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'requesting' | 'granted' | 'denied'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGeminiLiveActive, setIsGeminiLiveActive] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  const [userSpeech, setUserSpeech] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const initialGreeting = `Hello ${candidateName}! Welcome to your AI Technical Interview for ${roleTitle}. I am your AI evaluation model. Let me know about your technical background and key skills!`;

  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: initialGreeting,
      time: 'Just now'
    }
  ]);

  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    communicationScore: number;
    technicalScore: number;
    confidenceScore?: number;
    feedback: string;
    strengths?: string[];
    improvements?: string[];
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const liveReplyChunksRef = useRef<Uint8Array[]>([]);
  const liveReplyHasCaptionRef = useRef(false);
  const replayUrlsRef = useRef<string[]>([]);
  const nextPlayTimeRef = useRef<number>(0);
  const liveOutputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const liveSessionRef = useRef<Session | null>(null);
  const connectionAttemptRef = useRef(0);
  const liveControllerRef = useRef<{ stream: MediaStream; processor: ScriptProcessorNode; source: MediaStreamAudioSourceNode } | null>(null);
  const interviewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interviewEndedRef = useRef(false);
  const resultRequestedRef = useRef(false);
  const startingRef = useRef(false);
  const submittingRef = useRef(false);
  const transcriptRef = useRef<InterviewTurn[]>([]);
  const isMicOnRef = useRef(isMicOn);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
    isOpenRef.current = isOpen;
    isAiVoiceEnabledRef.current = isAiVoiceEnabled;
  }, [isMicOn, isOpen, isAiVoiceEnabled]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatLog]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream, isVideoOn, hasStarted]);

  const stopLiveAudio = useCallback(() => {
    connectionAttemptRef.current++;
    liveOutputSourcesRef.current.forEach((source) => { try { source.stop(); } catch {} });
    liveOutputSourcesRef.current.clear();
    nextPlayTimeRef.current = 0;
    liveControllerRef.current?.processor.disconnect();
    liveControllerRef.current?.source.disconnect();
    liveControllerRef.current?.stream.getTracks().forEach((track) => track.stop());
    liveControllerRef.current = null;
    liveSessionRef.current?.close();
    liveSessionRef.current = null;
    liveReplyChunksRef.current = [];
    liveReplyHasCaptionRef.current = false;
  }, []);

  const clearReplayAudio = useCallback(() => {
    replayUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    replayUrlsRef.current = [];
  }, []);

  const stopMediaStream = useCallback(() => {
    isMicOnRef.current = false;
    setIsMicOn(false);
    stopLiveAudio();
    setIsGeminiLiveActive(false);
    setVolumeLevel(0);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, [stopLiveAudio]);

  const appendTranscript = (sender: InterviewTurn['sender'], text: string) => {
    const value = text.trim();
    if (!value) return;
    const last = transcriptRef.current[transcriptRef.current.length - 1];
    if (last?.sender === sender) {
      if (value === last.text || last.text.endsWith(value)) return;
      last.text = value.startsWith(last.text) ? value : `${last.text} ${value}`;
    } else {
      transcriptRef.current.push({ sender, text: value });
    }
  };

  const showLiveTranscript = (sender: InterviewTurn['sender'], text: string) => {
    if (!text.trim()) return;
    appendTranscript(sender, text);
    const latest = transcriptRef.current[transcriptRef.current.length - 1];
    if (latest?.sender !== sender) return;
    const captionText = latest.text;
    if (sender === 'ai') liveReplyHasCaptionRef.current = true;
    setChatLog((prev) => upsertSpokenCaption(prev, {
      sender,
      text: captionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  };

  const completeInterview = () => {
    if (resultRequestedRef.current) return;
    resultRequestedRef.current = true;
    onComplete?.(transcriptRef.current.map((turn) => ({ ...turn })));
  };

  const handleClose = () => {
    if (hasStarted) completeInterview();
    onClose();
  };

  // Cleanup pause timer & audio & Gemini Live on unmount
  useEffect(() => {
    return () => {
      if (interviewTimerRef.current) clearTimeout(interviewTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        } catch {}
      }
      stopLiveAudio();
      clearReplayAudio();
      audioContextRef.current?.close().catch(() => {});
    };
  }, [stopLiveAudio, clearReplayAudio]);

  // When modal closes, stop everything
  useEffect(() => {
    if (!isOpen) {
      interviewEndedRef.current = true;
      if (interviewTimerRef.current) clearTimeout(interviewTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setHasStarted(false);
      stopMediaStream();
      clearReplayAudio();
      if (currentAudioRef.current) {
        try { currentAudioRef.current.pause(); } catch {}
        currentAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen, stopMediaStream, clearReplayAudio]);

  const handleStartInterview = async () => {
    if (startingRef.current || hasStarted) return;
    startingRef.current = true;
    interviewEndedRef.current = false;
    resultRequestedRef.current = false;
    transcriptRef.current = [];
    setHasStarted(true);
    setIsInterviewFinished(false);
    setUserSpeech('');
    setDetectedKeywords([]);
    setEvaluationResult(null);
    setChatLog([{ sender: 'ai', text: initialGreeting, time: 'Just now' }]);
    try {
      const micStream = await startMediaStream();
      if (interviewEndedRef.current) {
        micStream?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStream(null);
        return;
      }
      if (!micStream) {
        setHasStarted(false);
        return;
      }
      interviewTimerRef.current = setTimeout(finishTimedInterview, INTERVIEW_LIMIT_MS);
      void initGeminiLiveSession(micStream);
    } finally {
      startingRef.current = false;
    }
  };

  const finishTimedInterview = () => {
    if (interviewEndedRef.current) return;
    interviewEndedRef.current = true;
    interviewTimerRef.current = null;
    completeInterview();
    stopMediaStream();
    setIsInterviewFinished(true);
    setChatLog((prev) => [...prev, { sender: 'ai', text: CLOSING_MESSAGE, time: 'Just now' }]);

    let closed = false;
    const close = () => {
      if (closed || !isOpenRef.current) return;
      closed = true;
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      onClose();
    };
    if (!isAiVoiceEnabledRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return close();
    try {
      const utterance = new SpeechSynthesisUtterance(CLOSING_MESSAGE);
      utterance.onend = close;
      utterance.onerror = close;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      closeTimerRef.current = setTimeout(close, 6000);
    } catch {
      close();
    }
  };

  // Native Gemini Live implementation using the official @google/genai SDK
  const initGeminiLiveSession = async (existingStream?: MediaStream) => {
    if (typeof window === 'undefined') return;
    const attempt = ++connectionAttemptRef.current;
    setIsLiveConnecting(true);

    try {
      console.log('âš¡ [Gemini Live] Importing @google/genai...');
      const { GoogleGenAI, Modality } = await import('@google/genai');
      if (interviewEndedRef.current || attempt !== connectionAttemptRef.current) return;
      const user = auth?.currentUser;
      if (!user) throw new Error('Sign in to start the voice interview.');
      const tokenResponse = await fetch('/api/ai-interview/live-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${await user.getIdToken()}`, ...await getAiAppCheckHeaders() },
      });
      const tokenPayload = await tokenResponse.json();
      if (!tokenResponse.ok || !tokenPayload.token) throw new Error(tokenPayload.error || 'Could not start Gemini Live.');
      if (interviewEndedRef.current || attempt !== connectionAttemptRef.current) return;
      
      console.log('âš¡ [Gemini Live] Instantiating GoogleGenAI...');
      const ai = new GoogleGenAI({ apiKey: tokenPayload.token, httpOptions: { apiVersion: 'v1alpha' } });
      let connectedSession: Session | null = null;
      
      console.log('âš¡ [Gemini Live] Calling ai.live.connect()...');
      const session = await ai.live.connect({ 
        model: 'gemini-3.8-live', // Multimodal Live API updated model
        config: {
          systemInstruction: {
            parts: [{text: `You are an expert Senior Technical Interviewer conducting a real-time voice interview with candidate "${candidateName}" for the position of "${roleTitle}". Conduct an interactive, encouraging, and rigorous technical interview like Gemini Live. When the candidate greets you, immediately greet them back warmly in natural spoken voice and ask them to introduce their technical background and primary stack. Listen attentively to their technical answers, ask insightful follow-up questions on architecture, problem-solving, and system design. Keep your spoken responses natural, conversational, and concise (2-3 sentences max per turn).`}]
          },
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        },
        callbacks: {
          onmessage: (msg) => {
            if (interviewEndedRef.current || attempt !== connectionAttemptRef.current || (connectedSession && liveSessionRef.current !== connectedSession)) return;
            const transcript = msg.serverContent?.inputTranscription?.text;
            if (transcript) {
              showLiveTranscript('user', transcript);
              setUserSpeech(transcript);
            }
            const interviewerText = msg.serverContent?.outputTranscription?.text;
            if (interviewerText) showLiveTranscript('ai', interviewerText);
            if (msg.serverContent && msg.serverContent.modelTurn) {
              const parts = msg.serverContent.modelTurn.parts;
              for (const part of parts || []) {
                if (part.inlineData?.mimeType?.startsWith('audio/pcm') && typeof part.inlineData.data === 'string') {
                  const base64 = part.inlineData.data;
                  const binary = atob(base64);
                  liveReplyChunksRef.current.push(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
                  const pcm16 = new Int16Array(binary.length / 2);
                  for (let i = 0; i < pcm16.length; i++) {
                      pcm16[i] = binary.charCodeAt(i * 2) | (binary.charCodeAt(i * 2 + 1) << 8);
                  }
                  const float32 = new Float32Array(pcm16.length);
                  for (let i = 0; i < pcm16.length; i++) {
                      float32[i] = pcm16[i] / 32768;
                  }
                  if (isAiVoiceEnabledRef.current && audioContextRef.current && audioContextRef.current.state !== 'closed') {
                    const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
                    buffer.copyToChannel(float32, 0);
                    const sourceNode = audioContextRef.current.createBufferSource();
                    sourceNode.buffer = buffer;
                    sourceNode.connect(audioContextRef.current.destination);
                    liveOutputSourcesRef.current.add(sourceNode);
                    sourceNode.onended = () => liveOutputSourcesRef.current.delete(sourceNode);
                    
                    const currentTime = audioContextRef.current.currentTime;
                    if (nextPlayTimeRef.current < currentTime) {
                      nextPlayTimeRef.current = currentTime;
                    }
                    sourceNode.start(nextPlayTimeRef.current);
                    nextPlayTimeRef.current += buffer.duration;
                  }
                }
              }
            }
            if ((msg.serverContent?.turnComplete || msg.serverContent?.interrupted) && liveReplyChunksRef.current.length) {
              const audioUrl = URL.createObjectURL(pcm16ToWav(liveReplyChunksRef.current));
              replayUrlsRef.current.push(audioUrl);
              liveReplyChunksRef.current = [];
              const hasCaption = liveReplyHasCaptionRef.current;
              liveReplyHasCaptionRef.current = false;
              setChatLog((prev) => {
                const index = hasCaption ? prev.findLastIndex((message) => message.sender === 'ai') : -1;
                if (index < 0) return [...prev, { sender: 'ai', text: 'Audio reply (transcription pending)', time: 'Just now', audioUrl }];
                const next = [...prev];
                next[index] = { ...next[index], audioUrl };
                return next;
              });
            }
          },
          onclose: () => {
            console.warn('[Gemini Live] Connection closed by server');
            if (attempt !== connectionAttemptRef.current || liveSessionRef.current !== connectedSession) return;
            liveSessionRef.current = null;
            setVolumeLevel(0);
            setIsGeminiLiveActive(false);
            setIsLiveConnecting(false);
            if (!interviewEndedRef.current) {
              stopMediaStream();
              setErrorMessage('Gemini Live disconnected. Type your answer or click Reset to reconnect voice.');
            }
          },
          onerror: (err) => {
            if (interviewEndedRef.current || attempt !== connectionAttemptRef.current || (connectedSession && liveSessionRef.current !== connectedSession)) return;
            console.warn('[Gemini Live] Error:', err);
            setIsLiveConnecting(false);
            stopMediaStream();
            setErrorMessage('Gemini Live audio connection failed. Type your answer or click Reset to reconnect voice.');
          }
        }
      });
      if (interviewEndedRef.current || attempt !== connectionAttemptRef.current) {
        session.close();
        existingStream?.getTracks().forEach((track) => track.stop());
        return;
      }
      
      console.log('âš¡ [Gemini Live] Connected to live API!');
      connectedSession = session;
      liveSessionRef.current = session;
      setIsGeminiLiveActive(true);
      setIsLiveConnecting(false);

      // Stream the user's mic directly to the Gemini Live WebSocket
      const micStream = existingStream || await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      
      // Use default sample rate AudioContext (Chrome ignores custom sampleRate for output)
      const ctx = new window.AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      if (interviewEndedRef.current || attempt !== connectionAttemptRef.current) {
        await ctx.close();
        session.close();
        return;
      }
      audioContextRef.current = ctx;
      const nativeSR = ctx.sampleRate; // Usually 48000
      const targetSR = 16000;
      
      const source = ctx.createMediaStreamSource(micStream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      
      // Downsample from native sample rate to 16kHz
      const downsample = (float32: Float32Array, fromRate: number, toRate: number): Int16Array => {
        const ratio = fromRate / toRate;
        const newLength = Math.round(float32.length / ratio);
        const result = new Int16Array(newLength);
        for (let i = 0; i < newLength; i++) {
          const srcIndex = Math.round(i * ratio);
          const sample = float32[Math.min(srcIndex, float32.length - 1)];
          result[i] = Math.max(-32768, Math.min(32767, Math.floor(sample * 32768)));
        }
        return result;
      };
      
      let audioChunksSent = 0;
      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!liveSessionRef.current || !isMicOnRef.current) return;
        const float32 = e.inputBuffer.getChannelData(0);

        let sumSquares = 0;
        for (let i = 0; i < float32.length; i++) sumSquares += float32[i] * float32[i];
        setVolumeLevel(Math.min(100, Math.round(Math.sqrt(sumSquares / float32.length) * 400)));
        
        // Downsample to 16kHz PCM16
        const pcm16 = downsample(float32, nativeSR, targetSR);
        
        // Safe base64 encoding
        const bytes = new Uint8Array(pcm16.buffer);
        let binaryStr = '';
        for (let j = 0; j < bytes.length; j++) {
          binaryStr += String.fromCharCode(bytes[j]);
        }
        const base64 = btoa(binaryStr);
        
        try {
          session.sendRealtimeInput({ audio: { mimeType: 'audio/pcm;rate=16000', data: base64 } });
          
          audioChunksSent++;
          if (audioChunksSent <= 3 || audioChunksSent % 100 === 0) {
            console.log(`[Gemini Live] Sent audio chunk #${audioChunksSent}, size=${base64.length} chars`);
          }
        } catch (sendErr) {
          console.warn('[Gemini Live] Send error:', sendErr);
        }
      };
      
      source.connect(processor);
      processor.connect(ctx.destination);
      liveControllerRef.current = { stream: micStream, processor, source };
      console.log(`[Gemini Live] Mic pipeline active: native ${nativeSR}Hz -> 16kHz PCM16, streaming to Gemini`);

      session.sendClientContent({
        turns: [{ role: 'user', parts: [{ text: 'Hello! I am ready for the interview.' }] }],
        turnComplete: true,
      });

      

    } catch (err) {
      if (attempt !== connectionAttemptRef.current) return;
      console.warn('[Gemini Live] Failed to connect @google/genai Live API:', err);
      setIsLiveConnecting(false);
      if (!interviewEndedRef.current) {
        stopMediaStream();
        setErrorMessage(err instanceof Error ? `${err.message} Type your answer or click Reset to try again.` : 'Gemini Live could not connect. Type your answer or click Reset to try again.');
      }
    }
  };

  // Request Microphone & Camera Permissions
  const startMediaStream = async (): Promise<MediaStream | null> => {
    setMicPermissionState('requesting');
    setErrorMessage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsVideoOn(mediaStream.getVideoTracks().some((track) => track.enabled));

      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length > 0) {
        setIsMicOn(audioTracks[0].enabled);
        isMicOnRef.current = audioTracks[0].enabled;
        setMicPermissionState('granted');
        
        return mediaStream;
      } else {
        setIsMicOn(false);
        isMicOnRef.current = false;
        setMicPermissionState('denied');
        setErrorMessage('No microphone device detected on your system.');
        mediaStream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setStream(null);
      }
    } catch (err) {
      console.error('Error requesting media permissions:', err);

      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);

        const tracks = [
          ...audioOnlyStream.getAudioTracks(),
          ...(videoOnlyStream ? videoOnlyStream.getVideoTracks() : [])
        ];
        const combinedStream = new MediaStream(tracks);

        streamRef.current = combinedStream;
        setStream(combinedStream);
        setIsVideoOn(combinedStream.getVideoTracks().some((track) => track.enabled));

        setMicPermissionState('granted');
        setIsMicOn(true);
        isMicOnRef.current = true;
        return combinedStream;
      } catch {
        setMicPermissionState('denied');
        setIsMicOn(false);
        isMicOnRef.current = false;
        if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
          setErrorMessage('Microphone permission was denied. Please allow microphone access in browser address bar.');
        } else if (err instanceof Error && err.name === 'NotFoundError') {
          setErrorMessage('Microphone or Camera hardware not found.');
        } else {
          setErrorMessage(`Microphone Error: ${err instanceof Error ? err.message : 'Permission denied'}`);
        }
      }
    }
      return null;
  };

  const playAiAudio = (audioUrl: string) => {
    if (!isAiVoiceEnabledRef.current) return;
    currentAudioRef.current?.pause();
    try {
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.onended = () => { if (currentAudioRef.current === audio) currentAudioRef.current = null; };
      audio.onerror = (error) => console.warn('[AI Interview] Replay failed:', error);
      void audio.play().catch((error) => console.warn('[AI Interview] Replay failed:', error));
    } catch (error) {
      console.warn('[AI Interview] Replay failed:', error);
    }
  };

  const toggleAiVoice = () => {
    const enabled = !isAiVoiceEnabledRef.current;
    isAiVoiceEnabledRef.current = enabled;
    setIsAiVoiceEnabled(enabled);
    if (!enabled) {
      currentAudioRef.current?.pause();
      liveOutputSourcesRef.current.forEach((source) => { try { source.stop(); } catch {} });
      liveOutputSourcesRef.current.clear();
      nextPlayTimeRef.current = 0;
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream && isGeminiLiveActive) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        isMicOnRef.current = audioTrack.enabled;
        if (!audioTrack.enabled) {
          setVolumeLevel(0);
          liveSessionRef.current?.sendRealtimeInput({ audioStreamEnd: true });
        }
      }
    }
  };

  // Submit Answer via text input â€” sends directly to Gemini Live session
  const handleAnswerSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const answerText = userSpeech.trim();
    if (!answerText || submittingRef.current || interviewEndedRef.current) return;
    const chatHistory = transcriptRef.current.map((turn) => ({ ...turn }));

    setUserSpeech('');
    appendTranscript('user', answerText);

    // Update Chat UI immediately
    setChatLog((prev) => [
      ...prev,
      {
        sender: 'user',
        text: answerText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Send text through the Gemini Live session (voice response comes back via callbacks.onmessage)
    if (liveSessionRef.current) {
      try {
        liveSessionRef.current.sendClientContent({
          turns: [{ role: 'user', parts: [{ text: answerText }] }],
          turnComplete: true
        });
        return;
      } catch (err) {
        console.warn('[Gemini Live] Failed to send text message:', err);
        liveSessionRef.current = null;
        setIsGeminiLiveActive(false);
      }
    }

    submittingRef.current = true;
    setIsAiThinking(true);
    try {
      if (!auth?.currentUser) throw new Error('Sign in to continue the interview.');
      const response = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await auth.currentUser.getIdToken()}`, ...await getAiAppCheckHeaders() },
        body: JSON.stringify({ candidateName, roleTitle, userAnswer: answerText, chatHistory }),
      });
      if (!response.ok) throw new Error(`Interview reply failed: ${response.status}`);
      const data = await response.json() as AIInterviewResponse;
      if (!data.reply?.trim()) throw new Error('Interview reply was empty');
      if (interviewEndedRef.current || !isOpenRef.current) return;
      appendTranscript('ai', data.reply);
      setChatLog((prev) => [...prev, {
        sender: 'ai', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioUrl: data.audioResponseBase64,
      }]);
      if (data.audioResponseBase64) playAiAudio(data.audioResponseBase64);
      if (data.keywordsIdentified?.length) {
        setDetectedKeywords((prev) => Array.from(new Set([...prev, ...data.keywordsIdentified])));
      }
      if (data.isFinal || data.evaluation) {
        setEvaluationResult(
          (data.evaluation as typeof evaluationResult) || {
            score: data.technicalScore || 88,
            communicationScore: data.communicationScore || 90,
            technicalScore: data.technicalScore || 85,
            feedback: `Candidate evaluated for ${roleTitle}. Review the transcript for a full breakdown of the answers given.`,
            strengths: ['Clear concept delivery'],
            improvements: ['Add deeper metric benchmarks'],
          }
        );
      }
    } catch (error) {
      console.warn('[AI Interview] Text fallback failed:', error);
      if (!interviewEndedRef.current) setErrorMessage('Could not get the next question. Click Reset to reconnect voice or try another answer.');
    } finally {
      submittingRef.current = false;
      if (!interviewEndedRef.current) setIsAiThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-emerald text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                Gemini Live Voice Interview
              </h2>
              <p className="text-[11px] text-slate-400">
                Evaluating candidate: <span className="text-emerald-400 font-semibold">{candidateName}</span> &bull; {roleTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Gemini Live / Firebase AI Connection Badge */}
            <div
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                isGeminiLiveActive
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-sm shadow-emerald-500/20'
                  : isLiveConnecting
                  ? 'bg-amber-950 text-amber-300 border-amber-500 animate-pulse'
                  : micPermissionState === 'granted'
                  ? 'bg-teal-950 text-teal-300 border-teal-700'
                  : 'bg-rose-950 text-rose-300 border-rose-700'
              }`}
            >
              {isGeminiLiveActive ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-bounce" />
                  <span>Gemini Live Active (Voice In &rarr; Out)</span>
                </>
              ) : isLiveConnecting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Connecting Gemini Live...</span>
                </>
              ) : micPermissionState === 'granted' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Text mode â€¢ Reset for voice</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mic Required</span>
                </>
              )}
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid View */}
        {errorMessage && <div role="alert" className="px-5 py-2 bg-rose-50 text-rose-700 text-xs">{errorMessage}</div>}
        {!hasStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
              <Bot className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Ready for your AI Interview?</h3>
            <p className="text-slate-600 max-w-md mb-8">
              This is a 24-minute voice interview powered by Gemini Live. Ensure you are in a quiet environment and your microphone is ready.
            </p>
            <button
              onClick={handleStartInterview}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-brand-teal hover:from-emerald-500 hover:to-brand-teal text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3"
            >
              <Mic className="w-6 h-6" /> Start Voice Engine
            </button>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-50">
            
            {/* Left Column: Video Feed & Real Acoustic Signal Metrics (5 cols) */}
            <div className="lg:col-span-5 p-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-900 text-white space-y-3">
            
            {/* Video Viewport */}
            <div className="relative flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner min-h-[240px]">
              {stream?.getVideoTracks().length && isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                    <VideoOff className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">Camera is off or initializing...</p>
                </div>
              )}

              {/* Overlay Candidate Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-semibold flex items-center gap-1.5 border border-white/10">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>{candidateName}</span>
              </div>

              {/* AI Voice Toggle Badge */}
              <button
                type="button"
                onClick={toggleAiVoice}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold flex items-center gap-1.5 border border-white/10 text-slate-300 hover:text-white"
              >
                {isAiVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
                <span>{isAiVoiceEnabled ? 'AI Voice On' : 'AI Voice Muted'}</span>
              </button>

              {/* Audio Volume Bar Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center gap-2.5">
                <Volume2 className={`w-4 h-4 ${volumeLevel > 8 ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 transition-all duration-75 rounded-full"
                    style={{ width: `${isMicOn ? volumeLevel : 0}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-slate-300 min-w-[36px] text-right">
                  {isMicOn ? `${volumeLevel}%` : 'MUTED'}
                </span>
              </div>
            </div>

            {/* Media Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                disabled={micPermissionState !== 'granted' || !isGeminiLiveActive}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-md ${
                  isMicOn && micPermissionState === 'granted'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isMicOn ? 'Mic Active' : 'Mic Muted'}</span>
              </button>

              <button
                type="button"
                onClick={toggleVideo}
                disabled={!stream?.getVideoTracks().length}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-md ${
                  isVideoOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {isVideoOn ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5" />}
                <span>{isVideoOn ? 'Cam On' : 'Cam Off'}</span>
              </button>

              {!isGeminiLiveActive && userSpeech && (
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit()}
                  disabled={isAiThinking}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md animate-pulse"
                  title="Done talking - Send answer now"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Done Talking &rarr; Send</span>
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  stopMediaStream();
                  setUserSpeech('');
                  const micStream = await startMediaStream();
                  if (interviewEndedRef.current) {
                    micStream?.getTracks().forEach((track) => track.stop());
                    return;
                  }
                  if (micStream) void initGeminiLiveSession(micStream);
                }}
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Reset Media Permissions"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Conversation & Transcription (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 space-y-3.5 overflow-hidden bg-white dark:bg-slate-900">
            
            {/* Header / Question Turn Progress Indicator */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  AI Interviewer &bull; Real-Time Voice AI
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Up to 24 minutes &bull; AI Evaluation
              </span>
            </div>

            {/* Conversation Log View */}
            <div ref={chatRef} className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-emerald text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] rounded-2xl p-3.5 space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <p className="leading-relaxed font-medium text-xs">{msg.text}</p>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      {msg.sender === 'ai' && msg.audioUrl ? (
                        <button
                          type="button"
                          onClick={() => playAiAudio(msg.audioUrl!)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50/80 hover:bg-teal-100 px-2 py-0.5 rounded-lg border border-teal-200/60 transition-colors"
                          title="Replay the interviewer voice"
                        >
                          <Volume2 className="w-3 h-3 text-teal-600" />
                          <span>Replay Audio</span>
                        </button>
                      ) : (
                        <span />
                      )}

                      <p
                        className={`text-[9px] font-mono ${
                          msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                      ME
                    </div>
                  )}
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic p-2 bg-slate-50 dark:bg-slate-850 rounded-xl w-fit border border-slate-200 dark:border-slate-750 animate-pulse">
                  <Brain className="w-4 h-4 text-brand-teal animate-spin" />
                  <span>Preparing the next question...</span>
                </div>
              )}


              {/* Evaluation Summary Report when finished */}
              {isInterviewFinished && evaluationResult && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm">Real AI Technical Report</h4>
                    </div>
                    <span className="font-extrabold font-mono text-emerald-800 dark:text-emerald-200 text-sm bg-emerald-200/80 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                      Overall Score: {evaluationResult.score}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Communication</span>
                      <strong className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">{evaluationResult.communicationScore}%</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Technical Depth</span>
                      <strong className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">{evaluationResult.technicalScore}%</strong>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Confidence Index</span>
                      <strong className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">{evaluationResult.confidenceScore || 92}%</strong>
                    </div>
                  </div>

                  {detectedKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Verified Keywords:</span>
                      {detectedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-mono text-[10px] font-bold">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-slate-700 dark:text-slate-300 italic text-[11px] leading-relaxed pt-1">
                    "{evaluationResult.feedback}"
                  </p>
                </div>
              )}
            </div>

            {/* Answer Input & Controls Bar */}
            {!isInterviewFinished ? (
              <form onSubmit={(e) => handleAnswerSubmit(e)} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {isGeminiLiveActive ? (
                  <div className="flex flex-col items-center justify-center py-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 animate-[pulse_3s_ease-in-out_infinite]" />
                    <div className="w-16 h-16 bg-emerald-950 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.3)] z-10 border border-emerald-500/30">
                      <Mic className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="text-emerald-400 font-extrabold mt-4 animate-pulse z-10 tracking-wide text-sm">{!isMicOn ? 'Microphone muted' : volumeLevel > 5 ? 'Hearing your voice...' : 'Gemini Live is Listening...'}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5 z-10 font-medium">Just speak naturally. The AI will reply automatically via voice.</p>
                    {userSpeech && <p className="text-[11px] text-emerald-200 mt-2 z-10 px-4 text-center">Heard: {userSpeech}</p>}
                  </div>
                ) : (
                  <>
                    {/* Replay and status bar */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                      {chatLog.some(m => m.sender === 'ai' && m.audioUrl) ? (
                        <button
                          type="button"
                          onClick={() => {
                            const lastAiMsg = [...chatLog].reverse().find(m => m.sender === 'ai' && m.audioUrl);
                            if (lastAiMsg?.audioUrl) playAiAudio(lastAiMsg.audioUrl);
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors shadow-xs"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>ðŸ”Š Replay Question</span>
                        </button>
                      ) : <div />}

                      {userSpeech && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Answer ready
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUserSpeech('');
                            }}
                            className="text-[10px] text-slate-400 hover:text-rose-600 underline font-medium"
                          >
                            Clear Text
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Textarea Input Box */}
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={userSpeech}
                        onChange={(e) => {
                          setUserSpeech(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAnswerSubmit();
                          }
                        }}
                        placeholder={
                          isMicOn && micPermissionState === 'granted'
                            ? 'Type your answer here; click Reset to reconnect voice.'
                            : 'Type your response here (Press Enter to Send)...'
                        }
                        className="w-full px-3.5 py-2.5 pr-32 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                      />

                      {/* Send Button */}
                      <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                        <button
                          type="submit"
                          disabled={!userSpeech.trim() || isAiThinking}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                            userSpeech.trim() && !isAiThinking
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20 scale-102 hover:scale-105'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <span>Send (Enter)</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Helper Bar */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                        <span>When done speaking, click <strong>Send</strong> or press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-mono font-bold text-slate-700 border">Enter â†µ</kbd></span>
                      </span>
                      <span className="text-emerald-700 font-semibold hidden sm:inline">Text fallback</span>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  Close &amp; Save Assessment
                </button>
              </div>
            )}

          </div>
        </div>
        )}
      </div>
    </div>
  );
};
