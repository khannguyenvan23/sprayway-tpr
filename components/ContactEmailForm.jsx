"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export default function ContactEmailForm() {
  const [form, setForm] = useState(initialForm);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    const subject = `Lien he tu website - ${form.name || "Khach hang"}`;
    const body = [
      `Ho ten: ${form.name}`,
      `Email: ${form.email}`,
      `So dien thoai: ${form.phone}`,
      `Cong ty/Xuong: ${form.company}`,
      "",
      "Noi dung:",
      form.message,
    ].join("\n");

    window.location.href = `mailto:info@qeagencygroup.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-form" onSubmit={submitForm}>
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
      <button className="button primary" type="submit">Gửi email liên hệ</button>
    </form>
  );
}
