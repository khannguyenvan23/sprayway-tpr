"use client";

import { useEffect, useState } from "react";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function cookieDomain() {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return "";
  const parts = hostname.split(".");
  if (parts.length < 2) return "";
  return `; domain=.${parts.slice(-2).join(".")}`;
}

function setTranslateCookie(value) {
  document.cookie = `googtrans=${value}; path=/; max-age=${COOKIE_MAX_AGE}`;
  const domain = cookieDomain();
  if (domain) {
    document.cookie = `googtrans=${value}; path=/; max-age=${COOKIE_MAX_AGE}${domain}`;
  }
}

function triggerGoogleTranslate(nextLanguage) {
  const combo = document.querySelector(".goog-te-combo");
  if (!combo) return false;

  combo.value = nextLanguage === "en" ? "en" : "";
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function removeTranslateChrome() {
  document.documentElement.style.top = "0px";
  document.body.style.top = "0px";
  document.body.style.position = "static";
  document.querySelectorAll(".goog-te-banner-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd, iframe.skiptranslate").forEach((node) => {
    node.style.display = "none";
    node.style.visibility = "hidden";
  });
}

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("vi");

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "vi",
          includedLanguages: "vi,en",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.googleTranslateElementInit) {
      window.googleTranslateElementInit();
    }

    const cookie = document.cookie.split("; ").find((item) => item.startsWith("googtrans="));
    if (cookie?.includes("/en")) setLanguage("en");

    const cleanup = window.setInterval(removeTranslateChrome, 500);
    return () => window.clearInterval(cleanup);
  }, []);

  function switchLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setTranslateCookie(nextLanguage === "en" ? "/vi/en" : "/vi/vi");

    const translated = triggerGoogleTranslate(nextLanguage);
    window.setTimeout(removeTranslateChrome, 200);
    window.setTimeout(removeTranslateChrome, 900);
    if (!translated) {
      window.setTimeout(() => {
        if (!triggerGoogleTranslate(nextLanguage)) window.location.reload();
      }, 700);
    }
  }

  return (
    <div className="language-switcher" aria-label="Chọn ngôn ngữ">
      <div id="google_translate_element" aria-hidden="true" />
      <button
        aria-pressed={language === "vi"}
        className={language === "vi" ? "active" : ""}
        onClick={() => switchLanguage("vi")}
        type="button"
      >
        VI
      </button>
      <button
        aria-pressed={language === "en"}
        className={language === "en" ? "active" : ""}
        onClick={() => switchLanguage("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
