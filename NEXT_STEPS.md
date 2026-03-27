# CityPulse: Next Steps & Implementation Guide 🚀

This document outlines the remaining features needed to complete the core CityPulse experience, breaking down **what** we need to build and exactly **how** we will build it.

---

## 1. User Synchronization (Session Setup)
**The Problem:** Currently, when a user signs in via Clerk, they get a JWT token, but their profile info isn't guaranteed to exist in our PostgreSQL `users` table until they explicitly trigger a backend action. We need to ensure their account exists in the database immediately upon login.

**How we will implement it:**
- **Frontend Changes:** We will create a `UseSyncUser` React hook inside the `apps/web` folder.
- **Trigger:** We will mount a hidden `UserSyncProvider` component inside the main App layout that fires exactly once when the user successfully signs in.
- **Backend Flow:** It will hit the `POST /api/auth/sync` endpoint, which securely reads the user's Clerk profile from the JWT and uses `INSERT ... ON CONFLICT DO UPDATE` to save their name and avatar to the database.

---

## 2. Event Management (Edit & Delete)
**The Problem:** Users can create events, but they currently have no way to fix typos or delete canceled events from the platform.

**How we will implement it:**
- **Frontend changes:** 
  1. Add an **Edit** and **Delete** button on the Event Details page that is **only visible** if the `clerkUser.id` matches the event's `created_by` field.
  2. Create an `app/events/[id]/edit/page.tsx` page. This will reuse our existing `EventForm` component, but we will pass it the existing event data to pre-fill the inputs.
- **Backend Flow:** We already have the backend logic (`events.service.ts`) ready! It strictly validates that the user attempting the edit/delete is the true owner before modifying the database.

---

## 3. Feed Organization (Tabs & Filtering)
**The Problem:** Our main `. /feed` page shows a single, flat list of events. According to the original roadmap, users need a way to easily discover different types of events.

**How we will implement it:**
- **Frontend Changes:** We will modify `FeedList.tsx` to include three tabs: **"Live Now"**, **"Trending"**, and **"Upcoming"**.
- **Data Filtering:** We don't need new database calls! The backend already sends us a magical `is_live` boolean and a `score` field (based on likes and time-decay) for every event.
  - **Live Now tab:** We simply `filter(e => e.is_live === true)`
  - **Trending tab:** We grab events not active right now and sort them by `score`.
  - **Upcoming tab:** We sort remaining events chronologically by `start_time`.

---

## 4. Phase 4: AI Capabilities ✨
**The Goal:** The ultimate vision for CityPulse is to be "AI-powered". Once the core CRUD (Create, Read, Update, Delete) is finished, we will unlock standard features into smart features.

**How we will implement it:**
1. **Semantic Search:** Standard search only works if you type exact words (e.g. "Music Festival"). Semantic search will let you type *"I want to listen to live jazz outdoors"* and use OpenAI embeddings to find events that match the *vibe*, not just the keyword.
2. **Automated Event Tagging:** When a user creates an event, we will pass their description to an LLM to automatically generate and assign categories (tags) like `#Nightlife` or `#Networking`, making the feed much more intelligent.
3. **Personalized Feed:** We will adjust the raw feed `score` using AI by looking at what events the user has previously interacted with, ranking events tailored to their hidden preferences higher in the feed.

---

> **Ready to proceed?** Let me know which of these 4 steps sounds best to tackle next! (I recommend starting with **Step 1: User Synchronization** to ensure a solid foundation for the rest of the features).
