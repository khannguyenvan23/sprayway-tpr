alter table public.orders
add column if not exists order_number text unique;

alter table public.orders
add column if not exists payment_method text,
add column if not exists payment_status text,
add column if not exists shipping_method text,
add column if not exists shipping_name text,
add column if not exists shipping_eta text,
add column if not exists metadata jsonb not null default '{}'::jsonb;
