-- ============================================
-- FIX: DROP CONFLICTING POLICIES AND RECREATE
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add is_admin column if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Make yourself an admin
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'harshunitrix@gmail.com';

-- ============================================
-- DROP OLD CONFLICTING POLICIES
-- ============================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any listing" ON public.listings;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;

-- ============================================
-- RECREATE CORRECT POLICIES
-- ============================================

-- Profiles: Everyone can view (for listings to show seller info)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);

-- Listings: Everyone can view active listings
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON public.listings;
CREATE POLICY "Anyone can view listings"
ON public.listings FOR SELECT
USING (true);

-- Orders: Users can view their own OR admins can view all
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users and admins can view orders"
ON public.orders FOR SELECT
USING (
    auth.uid() = buyer_id 
    OR auth.uid() = seller_id
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Conversations: Users in conversation OR admins can view
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users and admins can view conversations"
ON public.conversations FOR SELECT
USING (
    auth.uid() = buyer_id 
    OR auth.uid() = seller_id
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Listings: Admins can update any listing
CREATE POLICY "Admins can update any listing"
ON public.listings FOR UPDATE
USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Listings: Admins can delete any listing
CREATE POLICY "Admins can delete any listing"
ON public.listings FOR DELETE
USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
    )
);

-- Verify the update worked
SELECT id, email, is_admin FROM public.profiles WHERE email = 'harshunitrix@gmail.com';
