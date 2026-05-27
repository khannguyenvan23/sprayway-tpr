"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function normalizeText(value = "") {
  return repairText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function repairText(value = "") {
  const text = String(value || "");
  const mojibakePattern = /[\u00c2\u00c3\u00c4\u00c6\u00e2][\u0080-\u00ff\u201a\u20ac]?|\u00e1[\u00ba\u00bb]/;
  if (!mojibakePattern.test(text)) return text;

  const decodePart = (part) => {
    try {
      const decoded = new TextDecoder("utf-8").decode(Uint8Array.from(Array.from(part), (char) => char.charCodeAt(0) & 255));
      return decoded.includes("�") ? part : decoded;
    } catch {
      return part;
    }
  };

  const decoded = decodePart(text);
  if (decoded !== text) return decoded;

  return text
    .split(/(\s+)/)
    .map((part) => (mojibakePattern.test(part) ? decodePart(part) : part))
    .join("");
}

function productMatches(product, keyword) {
  const haystack = normalizeText(
    [product.name, product.sku, product.code, product.brand, product.category, product.searchText].filter(Boolean).join(" "),
  );
  return haystack.includes(keyword);
}

function normalizeImageSrc(src = "") {
  if (!src) return "";
  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return `/api/asset?url=${encodeURIComponent(url.toString())}`;
    }
  } catch {
    const file = src.split("/").pop();
    return file ? `/assets/${file}` : "";
  }

  return src;
}

function toSuggestion(product) {
  return {
    id: product.firestoreId || product.id || product.slug,
    name: repairText(product.name),
    sku: repairText(product.sku),
    brand: repairText(product.brand),
    category: repairText(product.category),
    slug: product.slug,
    href: `/products/${product.slug}`,
    image: normalizeImageSrc(product.image || product.assetPath || ""),
  };
}

export default function SearchSuggestInput({
  id,
  value,
  onChange,
  onSelect,
  products,
  placeholder,
  ariaLabel,
  className = "",
}) {
  const [remoteSuggestions, setRemoteSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const keyword = normalizeText(value);

  const localSuggestions = useMemo(() => {
    if (!products?.length || keyword.length < 2) return [];
    return products.filter((product) => productMatches(product, keyword)).slice(0, 7).map(toSuggestion);
  }, [products, keyword]);

  useEffect(() => {
    if (products?.length || keyword.length < 2) {
      setRemoteSuggestions([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setHasSearched(false);
      try {
        const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(value.trim())}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          setRemoteSuggestions([]);
          return;
        }
        const data = await response.json();
        setRemoteSuggestions(data.suggestions || []);
      } catch {
        if (!controller.signal.aborted) setRemoteSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setHasSearched(true);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [products, keyword, value]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const suggestions = products?.length ? localSuggestions : remoteSuggestions;
  const canShowPanel = isOpen && keyword.length >= 2;
  const showSuggestions = canShowPanel && suggestions.length > 0;
  const showEmpty = canShowPanel && !isLoading && hasSearched && suggestions.length === 0;

  function selectSuggestion(suggestion) {
    onSelect?.(suggestion);
    setIsOpen(false);
  }

  return (
    <div className={`search-suggest${className ? ` ${className}` : ""}`} ref={wrapperRef}>
      <input
        aria-autocomplete="list"
        aria-expanded={canShowPanel}
        aria-label={ariaLabel}
        autoComplete="off"
        id={id}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        value={value}
      />
      {canShowPanel ? (
        <div className="search-suggest-menu" role="listbox">
          {isLoading ? <div className="search-suggest-status">Đang tìm sản phẩm...</div> : null}
          {showSuggestions
            ? suggestions.map((suggestion) => (
                <button
                  key={suggestion.id || suggestion.href}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                  role="option"
                  type="button"
                >
                  <span className="search-suggest-thumb">
                    {suggestion.image ? <img src={suggestion.image} alt="" /> : null}
                  </span>
                  <span className="search-suggest-text">
                    <strong>{suggestion.name}</strong>
                    <span>{[suggestion.sku, suggestion.brand, suggestion.category].filter(Boolean).join(" - ")}</span>
                  </span>
                </button>
              ))
            : null}
          {showEmpty ? <div className="search-suggest-status">Không tìm thấy sản phẩm phù hợp.</div> : null}
        </div>
      ) : null}
    </div>
  );
}
