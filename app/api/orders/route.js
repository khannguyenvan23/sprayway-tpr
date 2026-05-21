import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { normalizeOrderRow } from "@/lib/supabase-data";

export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = createSupabaseServiceClient();
    const orderNumber = String(body.id || createOrderNumber());

    const orderInsert = {
      order_number: orderNumber,
      customer_name: body.customer?.name || "",
      customer_email: body.customer?.email || null,
      customer_phone: body.customer?.phone || null,
      shipping_address: body.customer?.address || null,
      note: body.note || null,
      status: body.status || "pending_confirmation",
      subtotal: Number(body.subtotal || 0),
      shipping_fee: Number(body.shippingFee || 0),
      total: Number(body.total || 0),
      payment_method: body.paymentMethod || "COD",
      payment_status: body.paymentStatus || null,
      shipping_method: body.shippingMethod || null,
      shipping_name: body.shipping?.name || null,
      shipping_eta: body.shipping?.eta || null,
      metadata: {
        channel: body.channel || "web-checkout",
        shipping: body.shipping || null,
        paymentMethod: body.paymentMethod || null,
        paymentStatus: body.paymentStatus || null,
      },
    };

    const { data: orderRow, error: orderError } = await supabase
      .from("orders")
      .insert(orderInsert)
      .select("*")
      .single();

    if (orderError) {
      throw orderError;
    }

    const orderItems = (body.items || []).map((item) => ({
      order_id: orderRow.id,
      product_name: item.name || "",
      product_sku: item.sku || item.slug || "",
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
    }));

    if (orderItems.length) {
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) {
        throw itemsError;
      }
    }

    const { data: savedItems, error: itemsSelectError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderRow.id)
      .order("created_at", { ascending: true });

    if (itemsSelectError) {
      throw itemsSelectError;
    }

    return NextResponse.json(normalizeOrderRow(orderRow, savedItems || []));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể lưu đơn hàng." },
      { status: 500 },
    );
  }
}

function createOrderNumber() {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${ymd}-${suffix}`;
}
