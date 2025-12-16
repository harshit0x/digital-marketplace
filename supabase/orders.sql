-- ============================================
-- ORDERS/PAYMENTS SETUP
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add columns if not exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Drop existing policies
DROP POLICY IF EXISTS "orders_select" ON public.orders;
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_update" ON public.orders;

-- Orders policies
CREATE POLICY "orders_select" ON public.orders FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "orders_insert" ON public.orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "orders_update" ON public.orders FOR UPDATE
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
