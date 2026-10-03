# LAB 3 (NHÓM 2): TỔNG HỢP FULLSTACK INTEGRATION (NEXT.JS + EXPRESS)

- **Họ và tên:** Nông Thị Hồng Lan
- **Mã sinh viên:** N23DCPT029
- **Chủ đề:** Kết nối Frontend NextJS với Backend Express để quản lý bài viết (Blog Posts)

---

## 1. Cấu trúc dự án
```text
fullstack-blog/
├── backend/
│   ├── data.json        # Dữ liệu bài viết lưu trữ bền vững (Nâng cao 3)
│   ├── server.js        # RESTful API Server (GET, POST, PUT, DELETE)
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── posts/       # Trang quản lý bài viết (Form, Optimistic Delete, Inline Edit)
│   │   ├── layout.tsx   # Cấu hình Toaster thông báo toàn cục
│   │   └── page.tsx
│   ├── lib/
│   │   └── api.ts       # File cấu hình Axios trung tâm
│   └── package.json
├── .gitignore
└── README.md
```
## 2. Khởi chạy dự án
### BACKEND
```bash
cd backend
npm install
npm run dev
```
### FRONTEND
```bash
cd frontend
npm install
npm run dev
```
- Truy cập giao diện tại: http://localhost:3000/posts