/**
 * Seed script: Populate the DB with realistic Indian events.
 * Run with:  npx ts-node --project tsconfig.json src/scripts/seed-events.ts
 *
 * Strategy:
 *  1. Find the first existing user in the `users` table (or create a seed one).
 *  2. Insert 20 Indian events spanning multiple cities with proper PostGIS geometry.
 *  3. Skip events that already exist (idempotent via title + start_time dedup).
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20_000,
});

// ── Helper ───────────────────────────────────────────────────────────────────
function daysFromNow(days: number, hour = 18, minute = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
}

function hoursFromNow(hours: number): string {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    return d.toISOString();
}

// ── Events data ───────────────────────────────────────────────────────────────
// lat/lng for major Indian cities
const EVENTS = [
    // ─── Delhi NCR ─────────────────────────────────────────────────────────
    {
        title: 'Bhandara @ Sector 17 Gurudwara',
        description: 'Mahaprasad bhandara at the community Gurudwara. All are welcome — langar, kirtan, and full community gathering. Bring family and friends!',
        lat: 28.6692, lng: 77.4538,
        start_time: hoursFromNow(2),
        end_time: hoursFromNow(8),
        tags: ['Bhandara', 'Langar', 'Gurudwara', 'Community', 'Delhi'],
    },
    {
        title: 'Raat Bhar Jagrata — Ram Mandir Colony',
        description: 'All night Mata ki chowki and bhajan sandhya. DJ sound system, prasad vitran at midnight. Devotees from across the colony invited.',
        lat: 28.7041, lng: 77.1025,
        start_time: daysFromNow(0, 22, 0),
        end_time: daysFromNow(1, 6, 0),
        tags: ['Jagrata', 'Mata ki Chowki', 'Bhajan', 'Religious', 'Delhi'],
    },
    {
        title: 'Noida Startup Chai Pe Charcha',
        description: 'Founders, developers, and designers meet up for chai and conversation. Gupshup about product, funding, and building in India. Free entry, just register.',
        lat: 28.5355, lng: 77.3910,
        start_time: daysFromNow(2, 18, 30),
        end_time: daysFromNow(2, 21, 0),
        tags: ['Tech Meetup', 'Startup', 'Networking', 'Noida'],
    },
    {
        title: 'Antakshri Raat — DLF Phase 3',
        description: 'Old school antakshri night for the whole family! Bollywood songs, prizes for winners, and chai-pakoda. Entry free for residents.',
        lat: 28.4895, lng: 77.0878,
        start_time: daysFromNow(3, 19, 0),
        end_time: daysFromNow(3, 23, 0),
        tags: ['Antakshri', 'Bollywood', 'Fun', 'Family', 'Gurugram'],
    },

    // ─── Mumbai ──────────────────────────────────────────────────────────────
    {
        title: 'Ganpati Visarjan Procession — Lalbaug',
        description: 'Community Ganpati visarjan with dhol-tasha pathak, flowers, and gulal. Join thousands as we escort Bappa to the sea. Prasad and shrikhand distributed.',
        lat: 18.9634, lng: 72.8310,
        start_time: daysFromNow(1, 8, 0),
        end_time: daysFromNow(1, 16, 0),
        tags: ['Ganpati', 'Visarjan', 'Festival', 'Mumbai', 'Community'],
    },
    {
        title: 'Rooftop House Party — Bandra Saturday Night',
        description: 'Chill rooftop house party with 20-30 people. Bring your own drinks. Good vibes, city view, Spotify playlist. DM to get the address.',
        lat: 19.0596, lng: 72.8295,
        start_time: daysFromNow(5, 21, 0),
        end_time: daysFromNow(6, 2, 0),
        tags: ['House Party', 'Rooftop', 'Bandra', 'Mumbai', 'Weekend'],
    },
    {
        title: "Mumbai Street Food Crawl — Mohammed Ali Road",
        description: `EatMumbai community food crawl through Mohammed Ali Road. Kebabs, sheermal, nihari, firni, and more. A foodie's paradise — limited spots!`,
        lat: 18.9517, lng: 72.8339,
        start_time: daysFromNow(4, 19, 30),
        end_time: daysFromNow(4, 23, 0),
        tags: ['Street Food', 'Food Crawl', 'Mumbai', 'Kebab', 'Ramzan'],
    },

    // ─── Bengaluru ───────────────────────────────────────────────────────────
    {
        title: 'Bangalore Tech Founders Meetup — Koramangala',
        description: 'Monthly casual meetup for early-stage founders in Bangalore. 30-min lightning talks, open networking over coffee. No pitch decks allowed!',
        lat: 12.9352, lng: 77.6245,
        start_time: daysFromNow(6, 18, 0),
        end_time: daysFromNow(6, 21, 0),
        tags: ['Tech Meetup', 'Startup', 'Founders', 'Bangalore', 'Networking'],
    },
    {
        title: 'Ugadi Celebration — Jayanagar Cultural Hall',
        description: 'Traditional Ugadi celebration with bevu-bella, pachadi, classical music, and cultural performances. Families welcome. Celebrate Kannada New Year together!',
        lat: 12.9250, lng: 77.5938,
        start_time: daysFromNow(7, 10, 0),
        end_time: daysFromNow(7, 17, 0),
        tags: ['Ugadi', 'Festival', 'Kannada', 'Cultural', 'Bangalore'],
    },
    {
        title: 'IPL Watch Party — Whitefield',
        description: 'Huge screen IPL watch party! RCB vs CSK. Biryani, chaas, and loud commentary guaranteed. Come in team jerseys for extra fun.',
        lat: 12.9698, lng: 77.7500,
        start_time: daysFromNow(1, 19, 30),
        end_time: daysFromNow(1, 23, 30),
        tags: ['Cricket', 'IPL', 'Watch Party', 'Sports', 'Bangalore'],
    },

    // ─── Jaipur ───────────────────────────────────────────────────────────────
    {
        title: 'Navratri Garba Night — SMS Stadium',
        description: 'Grand Navratri Garba celebration at SMS Ground. Live dhol, professional choreography, traditional dress encouraged. 2000+ expected. Passes required.',
        lat: 26.8944, lng: 75.8069,
        start_time: daysFromNow(2, 21, 0),
        end_time: daysFromNow(3, 1, 0),
        tags: ['Garba', 'Navratri', 'Dance', 'Jaipur', 'Festival'],
    },
    {
        title: 'Dandiya Raas — Birla Auditorium',
        description: 'Annual Dandiya Raas hosted by Marwari Samaj. Traditional Rajasthani folk music, prizes for best couple dancer. Families and youngsters invited.',
        lat: 26.9124, lng: 75.7873,
        start_time: daysFromNow(3, 20, 0),
        end_time: daysFromNow(4, 0, 0),
        tags: ['Dandiya', 'Rajasthani', 'Dance', 'Jaipur', 'Navratri'],
    },
    {
        title: 'Pink City Mela — Johri Bazaar',
        description: 'Traditional bazaar mela with handloom textiles, silver jewellery, local snacks, and folk performances. Free entry. Bring cash!',
        lat: 26.9239, lng: 75.8267,
        start_time: daysFromNow(8, 11, 0),
        end_time: daysFromNow(8, 20, 0),
        tags: ['Mela', 'Bazaar', 'Shopping', 'Culture', 'Jaipur'],
    },

    // ─── Chandigarh ───────────────────────────────────────────────────────────
    {
        title: "Sector 17 Sunday Cricket League",
        description: 'Weekly Sunday morning cricket match at Sector 17 ground. Open to all skill levels. Teams of 11. WhatsApp to register. Chai and paratha after the match!',
        lat: 30.7414, lng: 76.7810,
        start_time: daysFromNow(4, 7, 0),
        end_time: daysFromNow(4, 12, 0),
        tags: ['Cricket', 'Sports', 'Sunday League', 'Chandigarh'],
    },
    {
        title: 'Chandigarh Mehendi Night — upcoming wedding',
        description: 'Open community mehendi event. 3 mehendi artists, live music, dhol, and ladies sangeet. Celebrate together! Strictly ladies only.',
        lat: 30.7333, lng: 76.7794,
        start_time: daysFromNow(5, 17, 0),
        end_time: daysFromNow(5, 22, 0),
        tags: ['Mehendi', 'Wedding', 'Ladies', 'Sangeet', 'Chandigarh'],
    },

    // ─── Hyderabad ────────────────────────────────────────────────────────────
    {
        title: 'Eid Mela — Charminar',
        description: 'Grand community Eid mela near Charminar. Haleem, biryani, kebab stalls, perfume bazaar, and children\'s rides. All communities welcome.',
        lat: 17.3616, lng: 78.4747,
        start_time: daysFromNow(0, 14, 0),
        end_time: daysFromNow(0, 22, 0),
        tags: ['Eid', 'Mela', 'Community', 'Hyderabad', 'Street Food'],
    },
    {
        title: 'Hyderabad Biryani Festival — HITEC City',
        description: '10+ biryani joints compete for the best biryani title voted by the public! Dum, Irani, Lucknowi, and fusion variants. ₹150 entry, unlimited tasting.',
        lat: 17.4435, lng: 78.3772,
        start_time: daysFromNow(9, 12, 0),
        end_time: daysFromNow(9, 20, 0),
        tags: ['Biryani', 'Food Festival', 'Hyderabad', 'Street Food'],
    },

    // ─── Pune ─────────────────────────────────────────────────────────────────
    {
        title: 'Pune House Party — Kothrud Terrace',
        description: 'Saturday night terrace house party. Mid-size gathering (~25 people). Good music, chilled beer, city lights. Send message for address and details.',
        lat: 18.5074, lng: 73.8077,
        start_time: daysFromNow(6, 21, 30),
        end_time: daysFromNow(7, 2, 0),
        tags: ['House Party', 'Terrace', 'Weekend', 'Pune'],
    },
    {
        title: 'Bhajan Sandhya — ISKCON Pune',
        description: 'Weekly Saturday bhajan sandhya at ISKCON Pune. Hare Krishna kirtan, meditation session, and free aloo puri prasad. All devotees welcome.',
        lat: 18.5204, lng: 73.8567,
        start_time: daysFromNow(5, 17, 30),
        end_time: daysFromNow(5, 20, 30),
        tags: ['Bhajan', 'Kirtan', 'ISKCON', 'Spiritual', 'Pune'],
    },

    // ─── Lucknow ──────────────────────────────────────────────────────────────
    {
        title: 'Lucknow Lucknavi Mushaira',
        description: 'Traditional Urdu mushaira with poets from across UP and Delhi. Ghazals, nazms, and nazaakat in the city of tehzeeb. Entry by invite/registration.',
        lat: 26.8467, lng: 80.9462,
        start_time: daysFromNow(10, 20, 0),
        end_time: daysFromNow(11, 0, 0),
        tags: ['Mushaira', 'Urdu', 'Poetry', 'Culture', 'Lucknow'],
    },
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🌱 Connecting to database...');
    const client = await pool.connect();

    try {
        // Find or create a seed user to assign events to
        const userRes = await client.query(
            'SELECT id FROM users ORDER BY created_at ASC LIMIT 1'
        );

        let userId: string;

        if (userRes.rows.length === 0) {
            // Create a system seed user
            console.log('ℹ️  No users found. Creating a seed user...');
            const newUser = await client.query(
                `INSERT INTO users (id, clerk_id, email, name)
                 VALUES (gen_random_uuid(), 'seed_system_user', 'seed@citypulse.in', 'CityPulse Team')
                 ON CONFLICT (clerk_id) DO UPDATE SET name = EXCLUDED.name
                 RETURNING id`
            );
            userId = newUser.rows[0].id;
        } else {
            userId = userRes.rows[0].id;
        }

        console.log(`✅ Using user ID: ${userId}`);
        console.log(`📅 Inserting ${EVENTS.length} Indian events...\n`);

        let inserted = 0;
        let skipped = 0;

        for (const event of EVENTS) {
            // Idempotent — skip if same title + start_time already exists
            const exists = await client.query(
                'SELECT 1 FROM events WHERE title = $1 AND start_time = $2',
                [event.title, event.start_time]
            );

            if (exists.rows.length > 0) {
                console.log(`  ⏭️  Skipped (already exists): ${event.title}`);
                skipped++;
                continue;
            }

            await client.query(
                `INSERT INTO events (id, title, description, location, start_time, end_time, created_by, tags)
                 VALUES (
                   gen_random_uuid(),
                   $1, $2,
                   ST_SetSRID(ST_MakePoint($3, $4), 4326),
                   $5, $6, $7, $8
                 )`,
                [
                    event.title,
                    event.description,
                    event.lng,      // ST_MakePoint(lng, lat)
                    event.lat,
                    event.start_time,
                    event.end_time,
                    userId,
                    event.tags,
                ]
            );

            console.log(`  ✅ Inserted: ${event.title}`);
            inserted++;
        }

        console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((err) => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
