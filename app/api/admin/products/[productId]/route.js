import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { normalizeProductRow, slugify } from "@/lib/supabase-data";
import { requireAdmin } from "@/lib/supabase-admin-api";

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const supabase = createSupabaseServiceClient();
    const { brandId, categoryId, brandName, categoryName } = await ensureRelations(
      supabase,
      body.brand,
      body.category,
    );

    const payload = buildPatchPayload(body, {
      brandId,
      categoryId,
      brandName,
      categoryName,
    });

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", params.productId)
      .select("*, brands(name,slug), categories(name,slug)")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm." }, { status: 404 });
    }

    return NextResponse.json(normalizeProductRow(data));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể cập nhật sản phẩm." },
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
    const { error } = await supabase.from("products").delete().eq("id", params.productId);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "KhÃ´ng thá»ƒ xÃ³a sáº£n pháº©m." },
      { status: 500 },
    );
  }
}

async function ensureRelations(supabase, brand, category) {
  const brandName = String(brand || "").trim();
  const categoryName = String(category || "").trim();

  const [brandRow, categoryRow] = await Promise.all([
    brandName ? upsertNamedRow(supabase, "brands", brandName) : Promise.resolve(null),
    categoryName ? upsertNamedRow(supabase, "categories", categoryName) : Promise.resolve(null),
  ]);

  return {
    brandId: brandRow?.id || null,
    categoryId: categoryRow?.id || null,
    brandName,
    categoryName,
  };
}

async function upsertNamedRow(supabase, table, name) {
  const payload = {
    name,
    slug: slugify(name),
  };

  const { data, error } = await supabase
    .from(table)
    .upsert(payload, { onConflict: "slug" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

function buildPatchPayload(body, relationIds) {
  const now = new Date().toISOString();
  const payload = {
    name: body.name ? String(body.name).trim() : undefined,
    sku: body.sku !== undefined ? String(body.sku).trim() || null : undefined,
    price: body.price !== undefined ? Number(body.price || 0) : undefined,
    stock: body.stock !== undefined ? Number(body.stock || 0) : undefined,
    status: body.status || undefined,
    featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
    brand_id: relationIds.brandId || undefined,
    category_id: relationIds.categoryId || undefined,
    short_description: body.shortDescription !== undefined ? String(body.shortDescription || "").trim() : undefined,
    description: body.fullDescription !== undefined ? String(body.fullDescription || "").trim() : undefined,
    image_url: body.image !== undefined ? String(body.image || "").trim() || null : undefined,
    updated_at: now,
  };

  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}
