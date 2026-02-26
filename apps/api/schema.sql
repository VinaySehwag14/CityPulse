-- =============================================================================
-- CityPulse – Database Schema
-- Target: Neon PostgreSQL (with PostGIS extension)
-- Source of truth: docs/DATABASE.md
-- Run this once when provisioning the database.
-- =============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────────

-- PostGIS: required for geography type on events.location
CREATE EXTENSION IF NOT EXISTS postgis;

-- pgcrypto: required for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- TABLE: users
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id    TEXT          NOT NULL UNIQUE,
  email       TEXT          NOT NULL,
  name        TEXT          NOT NULL,
  avatar      TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: events
-- =============================================================================

CREATE TABLE IF NOT EXISTS events (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT          NOT NULL,
  description TEXT,
  location    GEOGRAPHY(POINT, 4326) NOT NULL,
  start_time  TIMESTAMPTZ   NOT NULL,
  end_time    TIMESTAMPTZ   NOT NULL,
  created_by  UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- FEATURES.md §2: end_time must be after start_time
  CONSTRAINT events_end_after_start CHECK (end_time > start_time)
);

-- Indexes per DATABASE.md
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events (start_time);
CREATE INDEX IF NOT EXISTS idx_events_end_time   ON events (end_time);

-- Spatial index for geo search (Phase 2)
CREATE INDEX IF NOT EXISTS idx_events_location ON events USING GIST (location);

-- =============================================================================
-- TABLE: event_likes
-- =============================================================================

CREATE TABLE IF NOT EXISTS event_likes (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id    UUID          NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT event_likes_unique UNIQUE (user_id, event_id)
);

-- =============================================================================
-- TABLE: event_comments
-- =============================================================================

CREATE TABLE IF NOT EXISTS event_comments (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id    UUID          NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  content     TEXT          NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: event_attendees
-- =============================================================================

CREATE TABLE IF NOT EXISTS event_attendees (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id    UUID          NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status      TEXT          NOT NULL CHECK (status IN ('going', 'interested')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT event_attendees_unique UNIQUE (user_id, event_id)
);

-- =============================================================================
-- TABLE: user_follows
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_follows (
  follower_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (follower_id, following_id),

  -- Prevent self-follow
  CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);
