CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  source text
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON public.subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated inserts" ON public.subscribers FOR INSERT TO authenticated WITH CHECK (true);