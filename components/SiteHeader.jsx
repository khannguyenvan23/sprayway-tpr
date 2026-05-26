"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchSuggestInput from "./SearchSuggestInput";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const closeMenu = () => setIsOpen(false);

  function submitSearch(event) {
    event.preventDefault();
    const keyword = search.trim();
    window.location.href = keyword ? `/products?q=${encodeURIComponent(keyword)}` : "/products";
    closeMenu();
  }

  function openSuggestion(suggestion) {
    if (!suggestion?.href) return;
    window.location.href = suggestion.href;
    closeMenu();
  }

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="logo" href="/" onClick={closeMenu}>
          <img className="logo-image" src="/logo-01-main.png" alt="QE Agency Vietnam" />
        </Link>

        <form className="header-search" onSubmit={submitSearch}>
          <SearchSuggestInput
            ariaLabel="Tìm kiếm sản phẩm"
            value={search}
            onChange={setSearch}
            onSelect={openSuggestion}
            placeholder="Nhập mã, tên, ứng dụng..."
          />
          <button type="submit">Tìm</button>
        </form>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isOpen}
          aria-controls="primary-nav"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-nav" className={`nav-list${isOpen ? " open" : ""}`} aria-label="Chính">
          <form className="mobile-search" onSubmit={submitSearch}>
            <SearchSuggestInput
              ariaLabel="Tìm kiếm sản phẩm trên điện thoại"
              value={search}
              onChange={setSearch}
              onSelect={openSuggestion}
              placeholder="Nhập mã, tên, ứng dụng..."
            />
            <button type="submit">Tìm</button>
          </form>
          <Link href="/" onClick={closeMenu}>Trang chủ</Link>
          <Link href="/products" onClick={closeMenu}>Sản phẩm</Link>
          <a href="/#brands" onClick={closeMenu}>Thương hiệu</a>
          <a href="/#applications" onClick={closeMenu}>Ứng dụng</a>
          <Link href="/lien-he" onClick={closeMenu}>Liên hệ</Link>
          <LanguageSwitcher />
          <Link className="cta" href="/gioi-thieu" onClick={closeMenu}>Giới thiệu</Link>
        </nav>
      </div>
    </header>
  );
}
