# Sprayway Data Crawl

Workspace này đang dùng để crawl dữ liệu từ website hiện tại trước khi dựng website mới.

## Chạy crawl lại

```powershell
node scripts/crawl-sprayway.mjs https://sprayway-tpr.com/vn/trang-chu.html data/crawl
```

Kết quả thô:

- `data/crawl/pages.json`: toàn bộ trang đã crawl, gồm URL, title, meta description, heading, link, ảnh và text.
- `data/crawl/pages.csv`: bản CSV để xem nhanh bằng Excel.
- `data/crawl/html/`: HTML gốc của từng trang.
- `data/crawl/assets.json`: danh sách asset/ảnh.
- `data/crawl/images.csv`: danh sách ảnh.
- `data/crawl/assets/`: ảnh đã tải về.
- `data/crawl/failures.json`: URL lỗi, link hỏng hoặc trang không tải được.

## Tách sản phẩm

```powershell
node scripts/extract-products.mjs data/crawl data/processed
```

Kết quả đã xử lý bước đầu:

- `data/processed/products.json`: dữ liệu sản phẩm để dùng cho website mới.
- `data/processed/products.csv`: bản CSV để rà soát thủ công.
- `data/processed/brands.json`: thống kê thương hiệu.
- `data/processed/categories.json`: thống kê danh mục.

## Bước tiếp theo

1. Rà soát `products.csv`.
2. Chuẩn hóa tên sản phẩm, thương hiệu, danh mục.
3. Chọn sản phẩm nổi bật cho trang chủ.
4. Dùng `products.json` làm data source cho website mới.

## Tạo catalog chuẩn cho website mới

```powershell
node scripts/build-catalog.mjs data/processed/products.json data/catalog
```

Kết quả:

- `data/catalog/products.json`: catalog sản phẩm đã gom category, chuẩn hóa brand, tạo slug, mã sản phẩm, ảnh chính.
- `data/catalog/products.csv`: bảng rà soát sản phẩm bằng Excel.
- `data/catalog/data-issues.csv`: danh sách sản phẩm cần kiểm tra thủ công.
- `data/catalog/brands.json`: danh sách thương hiệu.
- `data/catalog/categories.json`: danh sách danh mục mới.
- `data/catalog/summary.json`: thống kê nhanh.

## Chạy prototype Next.js

```powershell
npm.cmd install
npm.cmd run dev
```

Sau đó mở:

- `http://localhost:3000/`: trang chủ
- `http://localhost:3000/products`: catalog sản phẩm có lọc brand/category
- `http://localhost:3000/products/077-dau-silicone-boi-tron-dang-uot`: ví dụ trang chi tiết

Build kiểm tra production:

```powershell
npm.cmd run build
```

## Seed catalog len Firestore

Script nay doc du lieu trong `data/catalog/products.json`, `categories.json`, `brands.json` va ghi len Firebase Firestore.

```powershell
npm.cmd run seed:firestore -- --project=time-tracking-app-d86ed
```

Collection duoc tao/cap nhat:

- `products`: moi san pham dung `slug` lam document id.
- `categories`: danh muc san pham.
- `brands`: thuong hieu.
- `catalogMeta/current`: metadata lan seed gan nhat.

## Data source cua website

Mac dinh website se doc catalog tu Firebase Firestore trong luc `npm.cmd run build`.

```powershell
npm.cmd run build
```

Neu can build bang file JSON local de debug:

```powershell
$env:CATALOG_SOURCE="json"; npm.cmd run build
```
