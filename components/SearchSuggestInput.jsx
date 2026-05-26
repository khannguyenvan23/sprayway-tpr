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

function toSuggestion(product) {
  return {
    id: product.firestoreId || product.id || product.slug,
    name: repairText(product.name),
    sku: repairText(product.sku),
    brand: repairText(product.brand),
    category: repairText(product.category),
    slug: product.slug,
    href: `/products/${product.slug}`,
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
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(value.trim())}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        setRemoteSuggestions(data.suggestions || []);
      } catch {
        if (!controller.signal.aborted) setRemoteSuggestions([]);
      }
    }, 160);

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
  const showSuggestions = isOpen && keyword.length >= 2 && suggestions.length > 0;

  function selectSuggestion(suggestion) {
    onSelect?.(suggestion);
    setIsOpen(false);
  }

  return (
    <div className={`search-suggest${className ? ` ${className}` : ""}`} ref={wrapperRef}>
      <input
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
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
      {showSuggestions ? (
        <div className="search-suggest-menu" role="listbox">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id || suggestion.href}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSuggestion(suggestion)}
              role="option"
              type="button"
            >
              <strong>{suggestion.name}</strong>
              <span>{[suggestion.sku, suggestion.brand, suggestion.category].filter(Boolean).join(" - ")}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
