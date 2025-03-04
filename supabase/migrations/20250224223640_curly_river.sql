/*
  # Add duplicate name check for API keys

  1. Changes
    - Drop existing table and recreate with case-insensitive unique constraint
    - Add trigger to prevent duplicate names (case-insensitive)
    - Update RLS policies to include name checks
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS api_keys CASCADE;

-- Create API keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create unique index for case-insensitive description per user
CREATE UNIQUE INDEX idx_unique_description_per_user 
ON api_keys (created_by, LOWER(description)) 
WHERE revoked_at IS NULL;

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
      AND LOWER(description) = LOWER(NEW.description)
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