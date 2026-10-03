import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
        Lab 3 Nhóm 2: Quản Lý Bài Viết (Next.js + Express)
      </h1>
      <Link
        href="/posts"
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
      >
        Truy cập trang Danh sách Bài viết →
      </Link>
    </main>
  );
}