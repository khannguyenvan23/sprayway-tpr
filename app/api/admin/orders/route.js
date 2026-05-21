import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { normalizeOrderRow } from "@/lib/supabase-data";
import { requireAdmin } from "@/lib/supabase-admin-api";

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    const orderIds = (orders || []).map((order) => order.id);
    const { data: items, error: itemsError } = orderIds.length
      ? await supabase.from("order_items").select("*").in("order_id", orderIds)
      : { data: [], error: null };

    if (itemsError) throw itemsError;

    const grouped = new Map();
    for (const item of items || []) {
      const list = grouped.get(item.order_id) || [];
      list.push(item);
      grouped.set(item.order_id, list);
    }

    return NextResponse.json(
      (orders || []).map((order) => normalizeOrderRow(order, grouped.get(order.id) || [])),
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể tải đơn hàng." },
      { status: 500 },
    );
  }
}
