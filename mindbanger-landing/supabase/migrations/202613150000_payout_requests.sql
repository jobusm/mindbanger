-- 1. Create table for payout requests
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    paypal_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add Row Level Security
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Affiliates can view their own payout requests" ON public.payout_requests
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.affiliates WHERE id = payout_requests.affiliate_id
        )
    );

CREATE POLICY "Affiliates can insert their own payout requests" ON public.payout_requests
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.affiliates WHERE id = payout_requests.affiliate_id
        )
    );

-- Admin policies (can do everything)
CREATE POLICY "Admins have full access to payout requests" ON public.payout_requests
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );
