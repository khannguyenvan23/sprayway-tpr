const RESEND_ENDPOINT = "https://api.resend.com/emails";

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml({ name, email, phone, company, message }) {
  const rows = [
    ["Họ tên", name],
    ["Email", email],
    ["Số điện thoại", phone],
    ["Công ty / xưởng", company || "Chưa cung cấp"],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.6">
      <h2 style="margin:0 0 16px">Liên hệ mới từ website QE Agency Trading</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="border:1px solid #dce3ee;padding:10px 12px;font-weight:700;width:170px">${escapeHtml(label)}</td>
                <td style="border:1px solid #dce3ee;padding:10px 12px">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </table>
      <h3 style="margin:22px 0 8px">Nội dung cần tư vấn</h3>
      <p style="white-space:pre-wrap;background:#f7f9fc;border:1px solid #dce3ee;border-radius:8px;padding:14px">${escapeHtml(message)}</p>
    </div>
  `;
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const name = cleanText(payload.name);
    const email = cleanText(payload.email);
    const phone = cleanText(payload.phone);
    const company = cleanText(payload.company);
    const message = cleanText(payload.message);
    const website = cleanText(payload.website);

    if (website) {
      return Response.json({ ok: true });
    }

    if (!name || !email || !phone || !message) {
      return Response.json({ error: "Vui lòng nhập đầy đủ họ tên, email, số điện thoại và nội dung." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Email không hợp lệ." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Chưa cấu hình RESEND_API_KEY trên server." }, { status: 500 });
    }

    const to = process.env.CONTACT_TO_EMAIL || "info@qeagencygroup.com";
    const from = process.env.CONTACT_FROM_EMAIL || "QE Agency Trading <onboarding@resend.dev>";
    const subject = `Liên hệ website - ${name}`;

    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject,
        html: buildEmailHtml({ name, email, phone, company, message }),
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return Response.json({ error: result.message || "Không gửi được email. Vui lòng thử lại." }, { status: 502 });
    }

    return Response.json({ ok: true, id: result.id });
  } catch (error) {
    return Response.json({ error: "Không xử lý được yêu cầu liên hệ." }, { status: 500 });
  }
}
