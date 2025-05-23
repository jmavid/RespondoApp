/*
  # API Keys Management Setup

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `description` (text, not null)
      - `key` (text, unique, not null)
      - `created_at` (timestamptz)
      - `revoked_at` (timestamptz, nullable)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Add unique constraint for description per user
    - Add indexes for performance

  3. Changes
    - Create table with proper constraints
    - Set up RLS policies
    - Add performance indexes
*/

-- Create API keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT unique_description_per_user UNIQUE (description, created_by)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies with proper security checks
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create their own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    NOT EXISTS (
      SELECT 1 FROM api_keys
      WHERE created_by = auth.uid()
      AND description = NEW.description
      AND revoked_at IS NULL
    )
  );

CREATE POLICY "Users can update their own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_api_keys_created_by ON api_keys(created_by);
CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_keys_revoked ON api_keys(revoked_at) WHERE revoked_at IS NULL;