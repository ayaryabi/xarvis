# Supabase Database Schema

This document outlines the tables based on the provided schema diagram.

## `organizations`

*   `id` (uuid, primary key)
*   `name` (text)
*   `settings` (jsonb)
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

## `users`

*   `id` (uuid, primary key)
*   `clerk_id` (text) - *Implied relation to Clerk authentication*
*   `email` (text)
*   `name` (text)
*   `avatar_url` (text)
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

## `subscription_plans`

*   `id` (uuid, primary key)
*   `name` (text)
*   `stripe_price_id` (text)
*   `monthly_price` (numeric)
*   `yearly_price` (numeric)
*   `limits` (jsonb)
*   `is_active` (bool)
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

## `organization_members`

*   `id` (uuid, primary key)
*   `organization_id` (uuid) - *Foreign Key -> organizations(id)*
*   `user_id` (uuid) - *Foreign Key -> users(id)*
*   `role` (text)
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

## `organization_subscriptions`

*   `id` (uuid, primary key)
*   `organization_id` (uuid) - *Foreign Key -> organizations(id)*
*   `plan_id` (uuid) - *Foreign Key -> subscription_plans(id)*
*   `stripe_subscription_id` (text)
*   `stripe_customer_id` (text)
*   `status` (text)
*   `current_period_end` (timestamptz)
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)
*   `trial_ends_at` (timestamptz)
*   `current_period_start` (timestamptz)

## `usage_logs`

*   `id` (uuid, primary key)
*   `organization_id` (uuid) - *Foreign Key -> organizations(id)*
*   `feature` (text)
*   `count` (int4)
*   `period_start` (timestamptz)
*   `period_end` (timestamptz)
*   `created_at` (timestamptz)

## `spaces`

*   `id` (uuid, primary key)
*   `organization_id` (uuid) - *Foreign Key -> organizations(id)*
*   `name` (text)
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

## `space_members`

*   `id` (uuid, primary key)
*   `space_id` (uuid) - *Foreign Key -> spaces(id)*
*   `member_id` (uuid) - *Implies relation to organization_members(id) or users(id)*
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

## `channels`

*   `id` (uuid, primary key)
*   `space_id` (uuid) - *Foreign Key -> spaces(id)*
*   `name` (text)
*   `topic` (text)
*   `created_by` (uuid) - *Likely Foreign Key -> users(id)*
*   `created_at` (timestamptz)
*   `updated_at` (timestamptz)

---
