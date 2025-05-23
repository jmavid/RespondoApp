/*
  # API Keys Management

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `description` (text, unique)
      - `key` (text, unique)
      - `created_at` (timestamp)
      - `revoked_at` (timestamp, nullable)
      - `created_by` (uuid, references profiles)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policies for authenticated users
*/

-- Create API keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT unique_description_per_user UNIQUE (description, created_by)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

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

-- Create index for better performance
CREATE INDEX idx_api_keys_created_by ON api_keys(created_by);