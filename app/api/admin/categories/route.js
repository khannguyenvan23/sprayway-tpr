import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase-service";
import { normalizeCategoryRow, slugify } from "@/lib/supabase-data";
import { requireAdmin } from "@/lib/supabase-admin-api";

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const [{ data: categories, error: categoriesError }, { data: products, error: productsError }] =
      await Promise.all([
        supabase.from("categories").select("*").order("name", { ascending: true }),
        supabase.from("products").select("category_id"),
      ]);

    if (categoriesError) throw categoriesError;
    if (productsError) throw productsError;

    const counts = new Map();
    for (const product of products || []) {
      if (!product.category_id) continue;
      counts.set(product.category_id, (counts.get(product.category_id) || 0) + 1);
    }

    return NextResponse.json((categories || []).map((category) => normalizeCategoryRow(category, counts.get(category.id) || 0)));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể tải danh mục." },
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
    const payload = {
      name: String(body.name || "").trim(),
      slug: slugify(body.name),
    };

    const { data, error } = await supabase
      .from("categories")
      .upsert(payload, { onConflict: "slug" })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(normalizeCategoryRow(data, 0));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Không thể thêm danh mục." },
      { status: 500 },
    );
  }
}
