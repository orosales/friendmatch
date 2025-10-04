-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST ((location::geometry));
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues USING GIST (ST_Point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_invites_start_time ON invites (start_time);
CREATE INDEX IF NOT EXISTS idx_invites_visibility ON invites (visibility);
CREATE INDEX IF NOT EXISTS idx_rsvps_user_invite ON rsvps (user_id, invite_id);
