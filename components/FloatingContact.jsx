"use client";

const contacts = [
  {
    className: "floating-contact-phone",
    label: "Goi hotline 0901890811",
    href: "tel:0901890811",
    text: "Hotline: 0901890811",
    icon: "call",
  },
  {
    label: "Lien he Facebook",
    href: "https://www.facebook.com/people/QE-Agency-Trading/61572594794264/",
    text: "Facebook",
    iconText: "f",
  },
  {
    label: "Zalo",
    href: "https://zalo.me/0901890811",
    text: "Zalo",
    iconText: "Zalo",
  },
];

function ContactIcon({ type }) {
  if (type === "call") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.7 21.9 2.1 13.3 2.1 3.4c0-.7.5-1.2 1.2-1.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.8.6 4 .1.4 0 .9-.3 1.2l-1.7 2.2Z" />
      </svg>
    );
  }

  return null;
}

export default function FloatingContact() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="floating-contact" aria-label="Lien he nhanh">
      {contacts.map((item) => (
        <a
          className={item.className}
          href={item.href}
          key={item.label}
          aria-label={item.label}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
        >
          {item.icon ? <ContactIcon type={item.icon} /> : null}
          {item.iconText ? <strong>{item.iconText}</strong> : null}
          <span>{item.text}</span>
        </a>
      ))}
      <button type="button" onClick={scrollToTop} aria-label="Len dau trang">
        <span>↑</span>
      </button>
    </div>
  );
}
