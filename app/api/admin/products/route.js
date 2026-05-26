import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { normalizeProductRow, slugify } from "@/lib/supabase-data";
import { requireAdmin } from "@/lib/supabase-admin-api";

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, brands(name,slug), categories(name,slug)")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json((data || []).map(normalizeProductRow));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể tải sản phẩm." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
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

    const payload = buildProductPayload(body, {
      brandId,
      categoryId,
      brandName,
      categoryName,
    });

    const { data, error } = await supabase
      .from("products")
      .upsert(payload, { onConflict: "slug" })
      .select("*, brands(name,slug), categories(name,slug)")
      .single();

    if (error) throw error;

    return NextResponse.json(normalizeProductRow(data));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể tạo sản phẩm." },
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

function buildProductPayload(body, relationIds) {
  const now = new Date().toISOString();
  const image = String(body.image || body.assetPath || "").trim();

  return {
    id: body.firestoreId || body.id || undefined,
    slug: String(body.slug || slugify(body.name)).trim(),
    name: String(body.name || "").trim(),
    sku: String(body.sku || "").trim() || null,
    brand_id: relationIds.brandId,
    category_id: relationIds.categoryId,
    price: Number(body.price || 0),
    compare_at_price: body.compareAtPrice ? Number(body.compareAtPrice) : null,
    stock: Number(body.stock || 0),
    status: body.status || "active",
    featured: Boolean(body.featured),
    short_description: String(body.shortDescription || "").trim(),
    description: String(body.fullDescription || "").trim(),
    image_url: image || null,
    gallery: body.gallery || [],
    metadata: {
      code: body.code || null,
      original_name: body.originalName || body.name || null,
      applications: body.applications || [],
      best_seller: Boolean(body.bestSeller),
      source_url: body.sourceUrl || null,
      search_text: body.searchText || null,
      import_source: "admin-panel",
      updated_at: now,
    },
    updated_at: now,
  };
}
