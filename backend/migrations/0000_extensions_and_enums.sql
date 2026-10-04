-- 0000_extensions_and_enums.sql
-- Extensions, shared enums, and the updated_at trigger helper.
-- Additive only: this file must remain replayable against a live deployment.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('student', 'industry', 'college', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended');
CREATE TYPE role_request_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

CREATE TYPE education_level AS ENUM ('college', 'puc', 'school');

CREATE TYPE skill_tier AS ENUM ('basic', 'intermediate', 'advanced');
CREATE TYPE learning_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE assessment_status AS ENUM ('locked', 'ready', 'passed', 'failed');
CREATE TYPE skill_verification_type AS ENUM (
  'claimed',
  'assessment_verified',
  'registry_verified',
  'resume_extracted'
);
CREATE TYPE skill_evidence_source AS ENUM (
  'self_declared',
  'resume',
  'assessment',
  'project',
  'certification'
);
CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE resource_type AS ENUM ('video', 'doc', 'article', 'practice', 'mini_project');
CREATE TYPE assessment_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'adaptive');

CREATE TYPE work_mode AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract');
CREATE TYPE opportunity_status AS ENUM ('draft', 'active', 'closed');
CREATE TYPE skill_importance AS ENUM ('required', 'preferred');

CREATE TYPE application_source AS ENUM ('internal', 'verified_api');
CREATE TYPE application_stage AS ENUM (
  'new_application',
  'screening',
  'shortlisted',
  'technical_interview',
  'hr_interview',
  'selected',
  'offer_sent',
  'hired',
  'rejected',
  'withdrawn'
);
CREATE TYPE interview_round AS ENUM (
  'technical',
  'hr',
  'leadership',
  'coding_assessment_review'
);
CREATE TYPE interview_mode AS ENUM ('online', 'offline');
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE offer_type AS ENUM (
  'full_time_employment',
  'internship_with_ppo',
  'summer_internship'
);
CREATE TYPE offer_status AS ENUM ('draft', 'sent', 'accepted', 'declined');

CREATE TYPE challenge_difficulty AS ENUM ('basic', 'intermediate', 'advanced');
CREATE TYPE challenge_status AS ENUM ('active', 'upcoming', 'closed');
CREATE TYPE submission_status AS ENUM (
  'under_review',
  'shortlisted',
  'winner',
  'interview_fast_tracked'
);

CREATE TYPE training_status AS ENUM ('active', 'upcoming', 'completed');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'completed', 'withdrawn');
CREATE TYPE announcement_category AS ENUM (
  'internship',
  'placement_drive',
  'training_program',
  'assessment_deadline',
  'industry_challenge',
  'workshop'
);
CREATE TYPE announcement_status AS ENUM ('published', 'draft');
CREATE TYPE placement_drive_status AS ENUM ('upcoming', 'ongoing', 'completed');
CREATE TYPE partnership_status AS ENUM ('active', 'pending', 'potential');
CREATE TYPE mou_status AS ENUM ('active', 'under_review', 'draft', 'renewed');
CREATE TYPE curriculum_module_status AS ENUM ('adopted', 'in_review', 'pending_senate_approval');
CREATE TYPE notification_type AS ENUM (
  'assessment',
  'opportunity',
  'badge',
  'profile',
  'system',
  'application',
  'shortlist',
  'offer',
  'interview',
  'challenge',
  'placement',
  'training',
  'match',
  'partnership',
  'pipeline',
  'internship',
  'gap'
);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
