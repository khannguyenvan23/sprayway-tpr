const ALLOWED_HOSTS = new Set(["sprayway-tpr.com", "www.sprayway-tpr.com"]);

function isAllowedImageUrl(url) {
  if (!["http:", "https:"].includes(url.protocol)) return false;
  if (ALLOWED_HOSTS.has(url.hostname)) return true;
  return url.hostname.endsWith(".supabase.co");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new Response("Missing image url", { status: 400 });
  }

  let imageUrl;
  try {
    imageUrl = new URL(rawUrl);
  } catch {
    return new Response("Invalid image url", { status: 400 });
  }

  if (!isAllowedImageUrl(imageUrl)) {
    return new Response("Image host is not allowed", { status: 403 });
  }

  const response = await fetch(imageUrl, {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0 QEAgencyImageProxy/1.0",
    },
    next: {
      revalidate: 60 * 60 * 24 * 7,
    },
  });

  if (!response.ok) {
    return new Response("Image unavailable", { status: response.status });
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return new Response("Unsupported asset type", { status: 415 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
    },
  });
}
