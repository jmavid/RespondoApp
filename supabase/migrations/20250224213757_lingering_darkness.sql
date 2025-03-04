/*
  # API Keys Management Setup

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `api_key` (text, unique)
      - `name` (text)
      - `description` (text)
      - `is_active` (boolean)
      - `last_used_at` (timestamptz)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `allowed_origins` (text[])
      - `rate_limit` (integer)
      - `permissions` (text[])

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Add indexes for performance
    - Add column comments

  3. Changes
    - Create table with proper constraints
    - Set up RLS policies
    - Add performance indexes
*/

-- Create API keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ,
  allowed_origins TEXT[],
  rate_limit INTEGER CHECK (rate_limit > 0),
  permissions TEXT[],
  CONSTRAINT valid_permissions CHECK (permissions IS NULL OR array_length(permissions, 1) > 0)
);

-- Add column comments
COMMENT ON TABLE api_keys IS 'Stores API keys for user authentication and authorization';
COMMENT ON COLUMN api_keys.id IS 'Unique identifier for the API key';
COMMENT ON COLUMN api_keys.user_id IS 'Reference to the user who owns this API key';
COMMENT ON COLUMN api_keys.api_key IS 'The actual API key value (hashed)';
COMMENT ON COLUMN api_keys.name IS 'User-provided name for the API key';
COMMENT ON COLUMN api_keys.description IS 'Optional description of the API key purpose';
COMMENT ON COLUMN api_keys.is_active IS 'Whether the API key is currently active';
COMMENT ON COLUMN api_keys.last_used_at IS 'Timestamp of the last API key usage';
COMMENT ON COLUMN api_keys.created_at IS 'Timestamp when the API key was created';
COMMENT ON COLUMN api_keys.expires_at IS 'Optional expiration timestamp for the API key';
COMMENT ON COLUMN api_keys.allowed_origins IS 'List of allowed origins for CORS';
COMMENT ON COLUMN api_keys.rate_limit IS 'Maximum number of requests per minute';
COMMENT ON COLUMN api_keys.permissions IS 'List of permissions granted to this API key';

-- Create indexes for better performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_api_keys_last_used_at ON api_keys(last_used_at);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to update last_used_at
CREATE OR REPLACE FUNCTION update_api_key_last_used()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE api_keys
  SET last_used_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating last_used_at
CREATE TRIGGER update_api_key_usage
  AFTER UPDATE OF is_active ON api_keys
  FOR EACH ROW
  WHEN (OLD.is_active = true AND NEW.is_active = true)
  EXECUTE FUNCTION update_api_key_last_used();