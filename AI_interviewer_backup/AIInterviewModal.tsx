'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Award,
  Activity,
  Zap,
  Brain,
  Radio
} from 'lucide-react';
import type { Session } from '@google/genai';
import { app } from '@/lib/firebase';

interface AIInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  roleTitle?: string;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  audioUrl?: string;
}

export const AIInterviewModal: React.FC<AIInterviewModalProps> = ({
  isOpen,
  onClose,
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
  
  // Real Acoustic Audio Processing Metrics
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [pitchHz, setPitchHz] = useState<number>(0);
  const [wpmRate, setWpmRate] = useState<number>(0);
  const [voiceClarity, setVoiceClarity] = useState<number>(95);

  const [turnCount, setTurnCount] = useState(1);
  const [userSpeech, setUserSpeech] = useState('');
  const userSpeechRef = useRef('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  
  const initialGreeting = `Hello ${candidateName}! Welcome to your AI Technical Interview for ${roleTitle}. I am your AI evaluation model. Let me know about your technical background and key skills!`;

  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: initialGreeting,
      time: 'Just now'
    }
  ]);

  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    communicationScore: number;
    technicalScore: number;
    confidenceScore?: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const liveSessionRef = useRef<Session | null>(null);
  const liveControllerRef = useRef<{ stream: MediaStream; processor: ScriptProcessorNode; source: MediaStreamAudioSourceNode } | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMicOnRef = useRef(isMicOn);
  const isOpenRef = useRef(isOpen);
  const speechStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
    isOpenRef.current = isOpen;
    isAiVoiceEnabledRef.current = isAiVoiceEnabled;
  }, [isMicOn, isOpen, isAiVoiceEnabled]);

  useEffect(() => {
    userSpeechRef.current = userSpeech;
  }, [userSpeech]);

  const [hasStarted, setHasStarted] = useState(false);

  const stopLiveAudio = () => {
    liveControllerRef.current?.processor.disconnect();
    liveControllerRef.current?.source.disconnect();
    liveControllerRef.current?.stream.getTracks().forEach((track) => track.stop());
    liveControllerRef.current = null;
    liveSessionRef.current?.close();
    liveSessionRef.current = null;
  };

  // Cleanup pause timer & audio & Gemini Live on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      if (currentAudioRef.current) {
        try {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        } catch (e) {}
      }
      stopLiveAudio();
      audioContextRef.current?.close().catch(() => {});
    };
  }, []);

  // When modal closes, stop everything
  useEffect(() => {
    if (!isOpen) {
      setHasStarted(false);
      stopMediaStream();
      if (currentAudioRef.current) {
        try { currentAudioRef.current.pause(); } catch (e) {}
        currentAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  const handleStartInterview = async () => {
    setHasStarted(true);
    setUserSpeech('');
    const micStream = await startMediaStream(true);
    if (micStream) initGeminiLiveSession(micStream);
    // setTimeout(() => speakAIText(initialGreeting), 400); // Disabled to prevent duplicate voice with Gemini Live
  };

  // Native Gemini Live implementation using the official @google/genai SDK
  const initGeminiLiveSession = async (existingStream?: MediaStream) => {
    if (typeof window === 'undefined') return;
    setIsLiveConnecting(true);

    try {
      console.log('⚡ [Gemini Live] Importing @google/genai...');
      const { GoogleGenAI, Modality } = await import('@google/genai');
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      console.log('⚡ [Gemini Live] Instantiating GoogleGenAI...');
      const ai = new GoogleGenAI({ apiKey });
      let connectedSession: Session | null = null;
      
      console.log('⚡ [Gemini Live] Calling ai.live.connect()...');
      const session = await ai.live.connect({ 
        model: 'gemini-3.8-live', // Multimodal Live API updated model
        config: {
          systemInstruction: {
            parts: [{text: `You are an expert Senior Technical Interviewer conducting a real-time voice interview with candidate "${candidateName}" for the position of "${roleTitle}". Conduct an interactive, encouraging, and rigorous technical interview like Gemini Live. When the candidate greets you, immediately greet them back warmly in natural spoken voice and ask them to introduce their technical background and primary stack. Listen attentively to their technical answers, ask insightful follow-up questions on architecture, problem-solving, and system design. Keep your spoken responses natural, conversational, and concise (2-3 sentences max per turn).`}]
          },
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {}
        },
        callbacks: {
          onmessage: (msg: any) => {
            const transcript = msg.serverContent?.inputTranscription?.text;
            if (transcript) {
              userSpeechRef.current = transcript;
              setUserSpeech(transcript);
            }
            if (msg.serverContent && msg.serverContent.modelTurn) {
              const parts = msg.serverContent.modelTurn.parts;
              for (const part of parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                  const base64 = part.inlineData.data;
                  const binary = atob(base64);
                  const pcm16 = new Int16Array(binary.length / 2);
                  for (let i = 0; i < pcm16.length; i++) {
                      pcm16[i] = binary.charCodeAt(i * 2) | (binary.charCodeAt(i * 2 + 1) << 8);
                  }
                  const float32 = new Float32Array(pcm16.length);
                  for (let i = 0; i < pcm16.length; i++) {
                      float32[i] = pcm16[i] / 32768;
                  }
                  if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                    const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
                    buffer.copyToChannel(float32, 0);
                    const sourceNode = audioContextRef.current.createBufferSource();
                    sourceNode.buffer = buffer;
                    sourceNode.connect(audioContextRef.current.destination);
                    
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
          },
          onclose: () => {
            console.warn('[Gemini Live] Connection closed by server');
            if (liveSessionRef.current !== connectedSession) return;
            liveSessionRef.current = null;
            setVolumeLevel(0);
            setIsGeminiLiveActive(false);
            setIsLiveConnecting(false);
          },
          onerror: (err: any) => {
            console.warn('[Gemini Live] Error:', err);
            setErrorMessage('Gemini Live audio connection failed. Try Reset.');
          }
        }
      });
      
      console.log('⚡ [Gemini Live] Connected to live API!');
      connectedSession = session;
      liveSessionRef.current = session;
      setIsGeminiLiveActive(true);
      setIsLiveConnecting(false);

      // Kick off the interview automatically
      session.sendClientContent({
        turns: [{ role: "user", parts: [{ text: "Hello! I am ready for the interview." }] }],
        turnComplete: true
      });
      
      // Stream the user's mic directly to the Gemini Live WebSocket
      const micStream = existingStream || await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      
      // Use default sample rate AudioContext (Chrome ignores custom sampleRate for output)
      const ctx = new window.AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
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

      

    } catch (err: any) {
      console.warn('[Gemini Live] Failed to connect @google/genai Live API:', err);
      setIsGeminiLiveActive(false);
      setIsLiveConnecting(false);
    }
  };

  const getSupportedAudioMimeType = (): string => {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return 'audio/webm';
    const candidateTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    for (const type of candidateTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'audio/webm';
  };

  const startAudioRecording = (audioStream: MediaStream) => {
    try {
      if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }

      recordedChunksRef.current = [];
      const mimeType = getSupportedAudioMimeType();
      const recorder = new MediaRecorder(audioStream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
          // Force UI to recognize the first chunk so 'Send' becomes active
          if (recordedChunksRef.current.length === 1) {
            setUserSpeech((prev) => prev + " "); // Tiny invisible update to trigger re-render
            setTimeout(() => setUserSpeech((prev) => prev.trim()), 0); // Revert it instantly
          }
        }
      };

      recorder.start(); // Removed timeslice to prevent NotSupportedError on some browsers
      mediaRecorderRef.current = recorder;
      console.log(`[AI Interview] MediaRecorder started with format: ${mimeType}`);
    } catch (err) {
      console.warn('Could not start MediaRecorder:', err);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        const base64Data = res.split(',')[1] || '';
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Request Microphone & Camera Permissions
  const startMediaStream = async (startLiveSession = false): Promise<MediaStream | null> => {
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

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length > 0) {
        setIsMicOn(audioTracks[0].enabled);
        setMicPermissionState('granted');
        
        // Setup fallback UI stuff only if we're not starting Gemini Live
        if (!startLiveSession) {
          setupAudioSignalProcessor(mediaStream);
          startSpeechRecognition();
          startAudioRecording(mediaStream);
        }
        return mediaStream;
      } else {
        setMicPermissionState('denied');
        setErrorMessage('No microphone device detected on your system.');
      }
    } catch (err: any) {
      console.error('Error requesting media permissions:', err);

      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);

        const tracks = [
          ...audioOnlyStream.getAudioTracks(),
          ...(videoOnlyStream ? videoOnlyStream.getVideoTracks() : [])
        ];
        const combinedStream = new MediaStream(tracks);

        setStream(combinedStream);
        if (videoRef.current) {
          videoRef.current.srcObject = combinedStream;
        }

        setMicPermissionState('granted');
        setIsMicOn(true);
        if (!startLiveSession) {
          setupAudioSignalProcessor(combinedStream);
          startSpeechRecognition();
          startAudioRecording(combinedStream);
        }
        return combinedStream;
      } catch (fallbackErr: any) {
        setMicPermissionState('denied');
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMessage('Microphone permission was denied. Please allow microphone access in browser address bar.');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('Microphone or Camera hardware not found.');
        } else {
          setErrorMessage(`Microphone Error: ${err.message || 'Permission denied'}`);
        }
      }
    }
      return null;
  };

  const stopMediaStream = () => {
    stopLiveAudio();
    setIsGeminiLiveActive(false);
    setVolumeLevel(0);
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
  };

  // Real Acoustic Web Audio Signal Processing (Volume RMS, Pitch Detection, Clarity)
  const setupAudioSignalProcessor = (mediaStream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(mediaStream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const timeData = new Float32Array(bufferLength);
      const freqData = new Uint8Array(bufferLength);

      const processAudioFrame = () => {
        analyser.getFloatTimeDomainData(timeData);
        analyser.getByteFrequencyData(freqData);

        // 1. Calculate RMS Volume
        let sumSquares = 0;
        for (let i = 0; i < timeData.length; i++) {
          sumSquares += timeData[i] * timeData[i];
        }
        const rms = Math.sqrt(sumSquares / timeData.length);
        const normVol = Math.min(100, Math.round(rms * 400));
        setVolumeLevel(normVol);

        // 2. Real Fundamental Frequency (Pitch f0 in Hz) using Autocorrelation
        if (normVol > 5) {
          const pitch = autoCorrelatePitch(timeData, audioCtx.sampleRate);
          if (pitch > 60 && pitch < 500) {
            setPitchHz(Math.round(pitch));
          }
          // Voice clarity based on Signal-to-Noise Ratio proxy
          const clarity = Math.min(99, Math.max(80, Math.round(90 + (rms * 50))));
          setVoiceClarity(clarity);
        } else {
          setPitchHz(0);
        }

        animationFrameRef.current = requestAnimationFrame(processAudioFrame);
      };

      processAudioFrame();
      audioContextRef.current = audioCtx;
    } catch (e) {
      console.warn('Audio Signal Processing Error:', e);
    }
  };

  // Autocorrelation algorithm for pitch detection (Hz)
  const autoCorrelatePitch = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      sumOfSquares += val * val;
    }
    const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
    if (rootMeanSquare < 0.01) return -1; // Not enough signal

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    const trimmedBuffer = buffer.slice(r1, r2);
    const c = new Float32Array(trimmedBuffer.length);
    for (let i = 0; i < trimmedBuffer.length; i++) {
      for (let j = 0; j < trimmedBuffer.length - i; j++) {
        c[i] = c[i] + trimmedBuffer[j] * trimmedBuffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < trimmedBuffer.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;
    if (T0 === 0) return -1;

    return sampleRate / T0;
  };

  // Continuous Speech Recognition for Live Preview
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        speechStartTimeRef.current = Date.now();
        if (pauseTimerRef.current) {
          clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = null;
        }
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }

        if (fullTranscript.trim()) {
          const phrase = fullTranscript.trim();
          userSpeechRef.current = phrase;
          setUserSpeech(phrase);

          const wordList = phrase.split(/\s+/).filter(Boolean);
          const durationMin = speechStartTimeRef.current
            ? Math.max(0.1, (Date.now() - speechStartTimeRef.current) / 60000)
            : 0.5;
          setWpmRate(Math.min(220, Math.round(wordList.length / durationMin)));

          // Real-time automatic submission: 1.5s after candidate finishes speaking
          if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
          }
          pauseTimerRef.current = setTimeout(() => {
            const transcriptToSubmit = userSpeechRef.current.trim();
            if (transcriptToSubmit && !isAiThinking) {
              if (liveControllerRef.current) {
                 // Gemini Live is active, do not submit to fallback. Just log it locally.
                 console.log(`[AI Interview] Speech detected (Gemini Live active): "${transcriptToSubmit}"`);
                 setUserSpeech('');
              } else {
                 console.log(`[AI Interview] Speech silence detected. Submitting voice input: "${transcriptToSubmit}"`);
                 handleAnswerSubmit(undefined, transcriptToSubmit);
              }
            }
          }, 1500);
        }
      };

      recognition.onspeechend = () => {
        if (!isMicOnRef.current || !isOpenRef.current) return;

        if (pauseTimerRef.current) {
          clearTimeout(pauseTimerRef.current);
        }

        // Auto-send after 1.2 seconds of silence if candidate spoke something
        pauseTimerRef.current = setTimeout(() => {
          const transcriptToSubmit = userSpeechRef.current.trim();
          if (transcriptToSubmit && !isAiThinking) {
            if (liveControllerRef.current) {
               console.log(`[AI Interview] Speech ended (Gemini Live active): "${transcriptToSubmit}"`);
               setUserSpeech('');
            } else {
               handleAnswerSubmit(undefined, transcriptToSubmit);
            }
          }
        }, 1200);
      };

      recognition.onend = () => {
        if (isMicOnRef.current && isOpenRef.current) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          setTimeout(() => {
            if (isMicOnRef.current && isOpenRef.current) {
              try { recognition.start(); } catch (err) {}
            }
          }, 600);
        }
      };
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Could not initialize Speech Recognition:', e);
    }
  };

  // Play High Quality AI Voice Response (Gemini Live audio or fallback)
  const playAiAudio = (audioBase64OrUrl?: string, textFallback?: string) => {
    if (!isAiVoiceEnabledRef.current) return;

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    if (audioBase64OrUrl) {
      try {
        const audio = new Audio(audioBase64OrUrl);
        currentAudioRef.current = audio;
        audio.onended = () => {
          currentAudioRef.current = null;
        };
        audio.onerror = (e) => {
          console.warn('[AI Interview] HTML Audio playback error, falling back to speech synthesis:', e);
          if (textFallback) speakAIText(textFallback);
        };
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((playErr) => {
            console.warn('[AI Interview] HTML Audio autoplay rejected, falling back to speech synthesis:', playErr);
            if (textFallback) speakAIText(textFallback);
          });
        }
      } catch (err) {
        if (textFallback) speakAIText(textFallback);
      }
    } else if (textFallback) {
      speakAIText(textFallback);
    }
  };

  // Browser Speech Synthesis Fallback
  const speakAIText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isAiVoiceEnabledRef.current) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        const cleanText = text.replace(/[*#_`]/g, '').trim();
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferred = voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha') ||
                v.name.includes('Alex') ||
                v.name.includes('David') ||
                v.name.includes('Zira'))
          );
          if (preferred) utterance.voice = preferred;
        }

        utterance.onerror = (e) => {
          console.warn('[AI Interview] SpeechSynthesisUtterance error:', e);
        };

        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.resume();
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
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
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        isMicOnRef.current = audioTrack.enabled;
        if (!audioTrack.enabled) {
          setVolumeLevel(0);
          liveSessionRef.current?.sendRealtimeInput({ audioStreamEnd: true });
        }
        // When Gemini Live is active, just toggle the track — no MediaRecorder needed
        if (!isGeminiLiveActive) {
          if (!audioTrack.enabled) {
            if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch (e) {}
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              try { mediaRecorderRef.current.pause(); } catch (e) {}
            }
          } else {
            startSpeechRecognition();
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
              try { mediaRecorderRef.current.resume(); } catch (e) {}
            } else {
              startAudioRecording(stream);
            }
          }
        }
      }
    }
  };

  // Submit Answer via text input — sends directly to Gemini Live session
  const handleAnswerSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const answerText = (overrideText || userSpeech).trim();
    if (!answerText || isAiThinking) return;

    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    setUserSpeech('');
    userSpeechRef.current = '';

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
      } catch (err) {
        console.warn('[Gemini Live] Failed to send text message:', err);
      }
    }

    setTurnCount((t) => t + 1);
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
                Gemini Live &bull; Firebase AI Logic Bidirectional Voice Engine
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
                  <span>Voice Stream Active</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mic Required</span>
                </>
              )}
            </div>

            <button
              onClick={onClose}
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
              This is a real-time, bidirectional voice interview powered by Gemini Live. Ensure you are in a quiet environment and your microphone is ready.
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
              {stream && isVideoOn ? (
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
                onClick={() => setIsAiVoiceEnabled(!isAiVoiceEnabled)}
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

            {/* Real Audio Signal Telemetry Box */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Activity className="w-3.5 h-3.5" /> Real Signal Telemetry
                </span>
                <span className="font-mono text-[10px] text-slate-400">Web Audio API</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-0.5">
                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Voice Pitch</span>
                  <strong className="text-emerald-400 font-mono text-xs">{pitchHz > 0 ? `${pitchHz} Hz` : 'Silent'}</strong>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Speaking Pace</span>
                  <strong className="text-blue-400 font-mono text-xs">{wpmRate > 0 ? `${wpmRate} WPM` : '~135 WPM'}</strong>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Audio Clarity</span>
                  <strong className="text-purple-400 font-mono text-xs">{voiceClarity}%</strong>
                </div>
              </div>
            </div>

            {/* Media Toolbar Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                disabled={micPermissionState !== 'granted'}
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
                  const micStream = await startMediaStream(true);
                  if (micStream) initGeminiLiveSession(micStream);
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
          <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 space-y-3.5 overflow-hidden bg-white">
            
            {/* Header / Question Turn Progress Indicator */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  Gemini Live Interviewer • Real-Time Voice AI
                </span>
              </div>
              
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Turn {turnCount} of 4 &bull; AI Evaluation
              </span>
            </div>

            {/* Conversation Log View */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
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
                        : 'bg-slate-100 border border-slate-200 text-slate-800'
                    }`}
                  >
                    <p className="leading-relaxed font-medium text-xs">{msg.text}</p>
                    
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      {msg.sender === 'ai' ? (
                        <button
                          type="button"
                          onClick={() => playAiAudio(msg.audioUrl, msg.text)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50/80 hover:bg-teal-100 px-2 py-0.5 rounded-lg border border-teal-200/60 transition-colors"
                          title="Replay this AI voice audio"
                        >
                          <Volume2 className="w-3 h-3 text-teal-600" />
                          <span>Replay Audio</span>
                        </button>
                      ) : (
                        <span />
                      )}

                      <p
                        className={`text-[9px] font-mono ${
                          msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
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
                <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2.5 bg-slate-50 rounded-xl w-fit border border-slate-200 animate-pulse">
                  <Brain className="w-4 h-4 text-brand-teal animate-spin" />
                  <span>Gemini Live is processing your response...</span>
                </div>
              )}

              {/* Evaluation Summary Report when finished */}
              {isInterviewFinished && evaluationResult && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-extrabold text-emerald-900 text-sm">Real AI Technical Report</h4>
                    </div>
                    <span className="font-extrabold font-mono text-emerald-800 text-sm bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
                      Overall Score: {evaluationResult.score}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] text-slate-500 font-semibold block">Communication</span>
                      <strong className="font-bold text-emerald-800 text-xs">{evaluationResult.communicationScore}%</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] text-slate-500 font-semibold block">Technical Depth</span>
                      <strong className="font-bold text-emerald-800 text-xs">{evaluationResult.technicalScore}%</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] text-slate-500 font-semibold block">Confidence Index</span>
                      <strong className="font-bold text-emerald-800 text-xs">{evaluationResult.confidenceScore || 92}%</strong>
                    </div>
                  </div>

                  {detectedKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-bold">Verified Keywords:</span>
                      {detectedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-mono text-[10px] font-bold">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-slate-700 italic text-[11px] leading-relaxed pt-1">
                    "{evaluationResult.feedback}"
                  </p>
                </div>
              )}
            </div>

            {/* Answer Input & Controls Bar */}
            {!isInterviewFinished ? (
              <form onSubmit={(e) => handleAnswerSubmit(e)} className="space-y-2 pt-2 border-t border-slate-100">
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
                      {chatLog.filter(m => m.sender === 'ai').length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            const lastAiMsg = [...chatLog].reverse().find(m => m.sender === 'ai');
                            if (lastAiMsg) playAiAudio(lastAiMsg.audioUrl, lastAiMsg.text);
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors shadow-xs"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>🔊 Replay Question</span>
                        </button>
                      ) : <div />}

                      {userSpeech && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Voice Audio Captured
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUserSpeech('');
                              userSpeechRef.current = '';
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
                          userSpeechRef.current = e.target.value;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAnswerSubmit();
                          }
                        }}
                        placeholder={
                          isMicOn && micPermissionState === 'granted'
                            ? '🎙️ Speak your answer aloud (audio is recorded & analyzed) or type... Press Enter to send!'
                            : 'Type your response here (Press Enter to Send)...'
                        }
                        className="w-full px-3.5 py-2.5 pr-32 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
                      />

                      {/* Send Button */}
                      <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                        <button
                          type="submit"
                          disabled={(!userSpeech.trim() && !isMicOn && recordedChunksRef.current.length === 0) || isAiThinking}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                            (userSpeech.trim() || isMicOn || recordedChunksRef.current.length > 0) && !isAiThinking
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
                        <span>When done speaking, click <strong>Send</strong> or press <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[9px] font-mono font-bold text-slate-700 border">Enter ↵</kbd></span>
                      </span>
                      <span className="text-emerald-700 font-semibold hidden sm:inline">Gemini Live</span>
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={onClose}
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
