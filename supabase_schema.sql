-- 1. Create the 'runs' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.runs (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    location TEXT NOT NULL,
    distance NUMERIC NOT NULL,
    time_of_day TEXT NOT NULL,
    image_url TEXT,
    run_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add user_id column (if it doesn't exist)
ALTER TABLE public.runs
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users (id) DEFAULT auth.uid ();

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies (Drop first to avoid conflicts)

-- Allow users to view only their own records
DROP POLICY IF EXISTS "Users can view own runs" ON public.runs;

CREATE POLICY "Users can view own runs" ON public.runs FOR
SELECT USING (auth.uid () = user_id);

-- Allow users to insert their own records
DROP POLICY IF EXISTS "Users can insert own runs" ON public.runs;

CREATE POLICY "Users can insert own runs" ON public.runs FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Allow users to update only their own records
DROP POLICY IF EXISTS "Users can update own runs" ON public.runs;

CREATE POLICY "Users can update own runs" ON public.runs FOR
UPDATE USING (auth.uid () = user_id)
WITH
    CHECK (auth.uid () = user_id);

-- Allow users to delete only their own records
DROP POLICY IF EXISTS "Users can delete own runs" ON public.runs;

CREATE POLICY "Users can delete own runs" ON public.runs FOR DELETE USING (auth.uid () = user_id);

-- 5. Storage Bucket Configuration (if needed)
INSERT INTO
    storage.buckets (id, name, public)
VALUES ('run_bk', 'run_bk', true) ON CONFLICT (id) DO
UPDATE
SET
    public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;

DROP POLICY IF EXISTS "Public Insert" ON storage.objects;

DROP POLICY IF EXISTS "Public Update" ON storage.objects;

DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'run_bk');

CREATE POLICY "Public Insert" ON storage.objects FOR
INSERT
WITH
    CHECK (bucket_id = 'run_bk');

CREATE POLICY "Public Update" ON storage.objects FOR
UPDATE
WITH
    CHECK (bucket_id = 'run_bk');

CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'run_bk');