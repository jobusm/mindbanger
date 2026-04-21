CREATE TABLE IF NOT EXISTS public.processed_stripe_events (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.processed_stripe_events ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage it
CREATE POLICY "Service Role can manage processed_stripe_events" 
  ON public.processed_stripe_events 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
