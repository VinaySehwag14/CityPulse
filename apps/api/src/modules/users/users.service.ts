// users.service.ts
// Business logic for user follow system.
// All DB access here. Extends existing users module.

import pool from '../../config/db';
import { resolveDbUserId } from '../../lib/resolveUser';
import type { User } from './users.types';

// ─── Get user by ID ────────────────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
    const result = await pool.query<User>(
        `SELECT id, clerk_id, email, name, avatar, bio, created_at
     FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0] ?? null;
}

// ─── Follow / Unfollow ────────────────────────────────────────────────────────

export interface ToggleFollowResult {
    following: boolean; // true = now following, false = unfollowed
}

// followerClerkId: the Clerk user ID of the person doing the following
// followingId: the DB UUID of the user being followed (from the profile URL)
export async function toggleFollow(
    followerClerkId: string,
    followingId: string
): Promise<ToggleFollowResult> {
    const followerDbId = await resolveDbUserId(followerClerkId);

    if (followerDbId === followingId) {
        const err = new Error('You cannot follow yourself') as Error & { statusCode: number };
        err.statusCode = 400;
        throw err;
    }

    const existing = await pool.query(
        `SELECT 1 FROM user_follows WHERE follower_id = $1 AND following_id = $2`,
        [followerDbId, followingId]
    );

    if (existing.rows.length > 0) {
        await pool.query(
            `DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2`,
            [followerDbId, followingId]
        );
        return { following: false };
    } else {
        await pool.query(
            `INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2)`,
            [followerDbId, followingId]
        );
        return { following: true };
    }
}

// ─── Followers ────────────────────────────────────────────────────────────────

export async function getFollowers(userId: string): Promise<User[]> {
    const result = await pool.query<User>(
        `SELECT u.id, u.clerk_id, u.email, u.name, u.avatar, u.bio, u.created_at
     FROM users u
     INNER JOIN user_follows f ON f.follower_id = u.id
     WHERE f.following_id = $1
     ORDER BY f.created_at DESC`,
        [userId]
    );
    return result.rows;
}

// ─── Following ────────────────────────────────────────────────────────────────

export async function getFollowing(userId: string): Promise<User[]> {
    const result = await pool.query<User>(
        `SELECT u.id, u.clerk_id, u.email, u.name, u.avatar, u.bio, u.created_at
     FROM users u
     INNER JOIN user_follows f ON f.following_id = u.id
     WHERE f.follower_id = $1
     ORDER BY f.created_at DESC`,
        [userId]
    );
    return result.rows;
}
