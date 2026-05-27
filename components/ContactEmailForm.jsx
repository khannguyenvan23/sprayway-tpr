"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
  website: "",
};

export default function ContactEmailForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Đang gửi thông tin liên hệ..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Không gửi được email. Vui lòng thử lại.");
      }

      setForm(initialForm);
      setStatus({ type: "success", message: "Đã gửi thông tin thành công. QE Agency sẽ phản hồi sớm." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  const isSubmitting = status.type === "loading";

  return (
    <form className="contact-form" onSubmit={submitForm}>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="contact-honeypot"
        name="website"
        onChange={updateField}
        tabIndex={-1}
        value={form.website}
      />

      <div className="contact-form-grid">
        <label>
          Họ và tên
          <input name="name" value={form.name} onChange={updateField} placeholder="Nhập họ tên" required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} placeholder="email@congty.com" required />
        </label>
        <label>
          Số điện thoại
          <input name="phone" value={form.phone} onChange={updateField} placeholder="0901 890 811" required />
        </label>
        <label>
          Công ty / xưởng
          <input name="company" value={form.company} onChange={updateField} placeholder="Tên công ty hoặc xưởng" />
        </label>
      </div>

      <label>
        Nội dung cần tư vấn
        <textarea
          name="message"
          value={form.message}
          onChange={updateField}
          placeholder="Bạn cần tư vấn sản phẩm, báo giá hay giải pháp website?"
          rows={6}
          required
        />
      </label>

      <button className="button primary" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Đang gửi..." : "Gửi nhu cầu tư vấn"}
      </button>

      {status.message ? (
        <p className={`contact-form-status ${status.type}`} role="status">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
