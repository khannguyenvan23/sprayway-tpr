"use client";

import { useEffect, useMemo, useState } from "react";
import { adminEmailDefault, clearAdminSession, readAdminSession, saveAdminSession } from "@/lib/admin-session";
import {
  createAdminCategory,
  deleteAdminCategory,
  listAdminCategories,
  signInAdmin,
  updateAdminCategory,
} from "@/lib/firebase-client";

const emptyDraft = {
  name: "",
  description: "",
};

export default function AdminCategoriesClient() {
  const [session, setSession] = useState(() => readAdminSession());
  const [email, setEmail] = useState(session?.email || adminEmailDefault);
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return categories.filter((category) => {
      const haystack = `${category.name} ${category.slug}`.toLowerCase();
      return !keyword || haystack.includes(keyword);
    });
  }, [categories, query]);

  useEffect(() => {
    if (session?.idToken && !categories.length) {
      loadCategories(session.idToken);
    }
  }, [session]);

  async function handleSignIn(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const nextSession = await signInAdmin(email.trim(), password);
      saveAdminSession(nextSession);
      setSession(nextSession);
      setPassword("");
      await loadCategories(nextSession.idToken);
    } catch (error) {
      setMessage(error.message || "Không thể đăng nhập admin.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories(idToken = session?.idToken) {
    if (!idToken) return;
    setIsLoading(true);
    setMessage("");
    try {
      const nextCategories = await listAdminCategories(idToken);
      setCategories(nextCategories);
      if (nextCategories.length) {
        const nextSelected = selected && nextCategories.find((item) => item.firestoreId === selected.firestoreId)
          ? nextCategories.find((item) => item.firestoreId === selected.firestoreId)
          : nextCategories[0];
        if (nextSelected) {
          selectCategory(nextSelected);
        } else {
          setSelected(null);
          setDraft(null);
        }
      } else {
        setSelected(null);
        setDraft(null);
      }
    } catch (error) {
      setMessage(error.message || "Không thể tải danh mục.");
    } finally {
      setIsLoading(false);
    }
  }

  function selectCategory(category) {
    setSelected(category);
    setDraft({
      name: category.name || "",
      description: category.description || "",
    });
  }

  function startCreateCategory() {
    setSelected(null);
    setDraft({ ...emptyDraft });
    setMessage("");
  }

  function updateDraft(event) {
    const { name, value } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveCategory(event) {
    event.preventDefault();
    if (!draft || !session?.idToken) return;

    const name = draft.name.trim();
    if (!name) {
      setMessage("Tên chuyên mục không được để trống.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    try {
      if (selected) {
        await updateAdminCategory(session.idToken, {
          id: selected.firestoreId,
          name,
        });
        setMessage("Đã cập nhật chuyên mục.");
      } else {
        await createAdminCategory(session.idToken, {
          name,
          description: draft.description.trim(),
        });
        setMessage("Đã thêm chuyên mục mới.");
      }
      await loadCategories(session.idToken);
    } catch (error) {
      setMessage(error.message || "Không thể lưu chuyên mục.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeCategory() {
    if (!selected || !session?.idToken || isDeleting) return;
    const confirmed = window.confirm(`Xóa chuyên mục "${selected.name}"?`);
    if (!confirmed) return;

    setIsDeleting(true);
    setMessage("");
    try {
      await deleteAdminCategory(session.idToken, selected.firestoreId);
      setMessage("Đã xóa chuyên mục.");
      await loadCategories(session.idToken);
    } catch (error) {
      setMessage(error.message || "Không thể xóa chuyên mục.");
    } finally {
      setIsDeleting(false);
    }
  }

  function signOut() {
    clearAdminSession();
    setSession(null);
    setCategories([]);
    setSelected(null);
    setDraft(null);
  }

  if (!session) {
    return (
      <form className="admin-login" onSubmit={handleSignIn}>
        <h2>Đăng nhập quản lý chuyên mục</h2>
        <div className="field">
          <label htmlFor="admin-category-email">Email admin</label>
          <input id="admin-category-email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="admin-category-password">Mật khẩu</label>
          <input id="admin-category-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button className="button primary" type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập admin"}
        </button>
        {message ? <p className="checkout-error">{message}</p> : null}
      </form>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-toolbar product-admin-toolbar">
        <div>
          <strong>{session.email}</strong>
          <span>{categories.length} chuyên mục</span>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm chuyên mục..." />
        <button className="button primary" type="button" onClick={startCreateCategory}>Thêm chuyên mục</button>
        <button className="button ghost" type="button" onClick={() => loadCategories()}>
          {isLoading ? "Đang tải..." : "Tải lại"}
        </button>
        <button className="button ghost" type="button" onClick={signOut}>Đăng xuất</button>
      </div>

      {message ? <p className="checkout-error">{message}</p> : null}

      <div className="product-admin-layout">
        <aside className="product-admin-list">
          {filtered.map((category) => (
            <button
              className={`admin-category-row${selected?.firestoreId === category.firestoreId ? " active" : ""}`}
              type="button"
              key={category.firestoreId}
              onClick={() => selectCategory(category)}
            >
              <span>
                <strong>{category.name}</strong>
                <small>{category.slug} - {category.count || 0} sản phẩm</small>
              </span>
            </button>
          ))}
        </aside>

        {draft ? (
          <form className="product-admin-form" onSubmit={saveCategory}>
            <div className="field">
              <label htmlFor="category-name">Tên chuyên mục</label>
              <input id="category-name" name="name" value={draft.name} onChange={updateDraft} required />
            </div>
            <div className="field">
              <label htmlFor="category-description">Mô tả</label>
              <textarea id="category-description" name="description" value={draft.description} onChange={updateDraft} />
            </div>
            <button className="button primary" type="submit" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : selected ? "Lưu chuyên mục" : "Tạo chuyên mục"}
            </button>
            {selected ? (
              <button className="button ghost" type="button" onClick={removeCategory} disabled={isDeleting || isSaving}>
                {isDeleting ? "Đang xóa..." : "Xóa chuyên mục"}
              </button>
            ) : null}
          </form>
        ) : (
          <div className="empty">Chọn một chuyên mục để chỉnh sửa hoặc bấm “Thêm chuyên mục”.</div>
        )}
      </div>
    </div>
  );
}
