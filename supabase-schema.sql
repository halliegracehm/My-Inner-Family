-- ============================================================
-- MY INNER FAMILY — SUPABASE SCHEMA
-- Run this entire file in your Supabase SQL Editor
-- ============================================================


-- ── FAMILIES ──────────────────────────────────────────────
CREATE TABLE families (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can read their family"
  ON families FOR SELECT
  USING (
    id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create a family"
  ON families FOR INSERT
  WITH CHECK (auth.uid() = created_by);


-- ── FAMILY MEMBERS ────────────────────────────────────────
CREATE TABLE family_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id),
  name        TEXT NOT NULL,
  emoji       TEXT DEFAULT '🌿',
  role        TEXT DEFAULT 'Member',
  is_admin    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read their own family members"
  ON family_members FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create their member profile"
  ON family_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can update their own profile"
  ON family_members FOR UPDATE
  USING (user_id = auth.uid());


-- ── JOURNAL ENTRIES ───────────────────────────────────────
CREATE TABLE journal_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID REFERENCES families(id) ON DELETE CASCADE,
  member_id   UUID REFERENCES family_members(id) ON DELETE CASCADE,
  title       TEXT,
  content     TEXT NOT NULL,
  mood_emoji  TEXT,
  is_shared   BOOLEAN DEFAULT true,
  prompt      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Shared entries visible to whole family; private only to author
CREATE POLICY "Read shared family entries or own entries"
  ON journal_entries FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
    AND (
      is_shared = true
      OR member_id IN (
        SELECT id FROM family_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Members can write entries for their family"
  ON journal_entries FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
    AND member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update their own entries"
  ON journal_entries FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can delete their own entries"
  ON journal_entries FOR DELETE
  USING (
    member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );


-- ── MOOD CHECK-INS ────────────────────────────────────────
CREATE TABLE mood_checkins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID REFERENCES families(id) ON DELETE CASCADE,
  member_id   UUID REFERENCES family_members(id) ON DELETE CASCADE,
  mood_emoji  TEXT NOT NULL,
  mood_label  TEXT,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(member_id, date)   -- one mood per member per day
);

ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can read moods in their family"
  ON mood_checkins FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can log their own moods"
  ON mood_checkins FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update their own mood"
  ON mood_checkins FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );


-- ── GRATITUDE NOTES ───────────────────────────────────────
CREATE TABLE gratitude_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id       UUID REFERENCES families(id) ON DELETE CASCADE,
  from_member_id  UUID REFERENCES family_members(id) ON DELETE CASCADE,
  to_member_id    UUID REFERENCES family_members(id) ON DELETE SET NULL,
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gratitude_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can read gratitude notes"
  ON gratitude_notes FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can write gratitude notes"
  ON gratitude_notes FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
    AND from_member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );


-- ── BADGES ────────────────────────────────────────────────
CREATE TABLE family_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID REFERENCES families(id) ON DELETE CASCADE,
  badge_id    TEXT NOT NULL,
  earned_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(family_id, badge_id)
);

ALTER TABLE family_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can read their badges"
  ON family_badges FOR SELECT
  USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Family members can earn badges"
  ON family_badges FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );


-- ── LETTERS TO THE FUTURE ─────────────────────────────────
CREATE TABLE future_letters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID REFERENCES families(id) ON DELETE CASCADE,
  member_id   UUID REFERENCES family_members(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  open_at     TIMESTAMPTZ NOT NULL,
  opened      BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE future_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors can read their own letters"
  ON future_letters FOR SELECT
  USING (
    member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can write letters"
  ON future_letters FOR INSERT
  WITH CHECK (
    member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can mark letters as opened"
  ON future_letters FOR UPDATE
  USING (
    member_id IN (
      SELECT id FROM family_members WHERE user_id = auth.uid()
    )
  );


-- ============================================================
-- DONE! All tables created with Row Level Security enabled.
-- ============================================================
