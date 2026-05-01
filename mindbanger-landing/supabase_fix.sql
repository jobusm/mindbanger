-- 1. Oprava UNIQUE constraintu pre upserty v Stripe webhooku
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_stripe_session_id_key;
ALTER TABLE referrals ADD CONSTRAINT referrals_stripe_session_id_key UNIQUE (stripe_session_id);

-- 2. Oprava check constraintu aby akceptoval 'waiting_second_month'
ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_status_check;

ALTER TABLE referrals ADD CONSTRAINT referrals_status_check 
CHECK (
  (status = 'pending' AND amount = 0) OR 
  (status IN ('pending', 'paid', 'canceled', 'waiting_second_month') AND amount > 0)
);
