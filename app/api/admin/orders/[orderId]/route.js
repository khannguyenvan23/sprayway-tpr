import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { normalizeOrderRow } from "@/lib/supabase-data";
import { requireAdmin } from "@/lib/supabase-admin-api";

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const supabase = createSupabaseServiceClient();
    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .update({
        status: body.status,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", params.orderId)
      .select("*")
      .maybeSingle();

    if (orderError) throw orderError;
    if (!orderRow) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderRow.id);

    if (itemsError) throw itemsError;

    return NextResponse.json(normalizeOrderRow(orderRow, items || []));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể cập nhật đơn hàng." },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("order_number", params.orderId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể xóa đơn hàng." },
      { status: 500 },
    );
  }
}
