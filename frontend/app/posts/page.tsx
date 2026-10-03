'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt?: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editAuthor, setEditAuthor] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await api.get<Post[]>('/api/posts');
      setPosts(res.data);
    } catch (err) {
      toast.error('Không thể kết nối server!');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bài viết!');
      return;
    }

    try {
      await toast.promise(
        api.post('/api/posts', { title, content, author }),
        {
          loading: 'Đang lưu...',
          success: 'Đăng bài thành công!',
          error: (err) => err.response?.data?.error || 'Có lỗi xảy ra!'
        }
      );
      setTitle('');
      setContent('');
      setAuthor('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xoá bài viết này?')) return;
    const previousPosts = [...posts];
    setPosts((prev) => prev.filter((p) => p.id !== id));

    try {
      await api.delete(`/api/posts/${id}`);
      toast.success('Đã xoá bài viết', { icon: '🗑️' });
    } catch (err) {
      toast.error('Xoá thất bại, thử lại!');
      setPosts(previousPosts);
    }
  };

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditAuthor(post.author);
  };
  const handleUpdate = async (id: number) => {
    if (!editTitle.trim() || !editContent.trim() || !editAuthor.trim()) {
      toast.error('Không được để trống thông tin khi sửa!');
      return;
    }

    try {
      await toast.promise(
        api.put(`/api/posts/${id}`, {
          title: editTitle,
          content: editContent,
          author: editAuthor
        }),
        {
          loading: 'Đang cập nhật...',
          success: 'Cập nhật bài viết thành công!',
          error: 'Cập nhật thất bại!'
        }
      );
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Quản Lý Bài Viết (Blog Posts)
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Lab 3 - Nhóm 2: Fullstack Integration NextJS + Express
          </p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Đăng bài viết mới</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tiêu đề bài viết"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Tên tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <textarea
              placeholder="Nội dung bài viết..."
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="text-right">
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-indigo-700 transition"
              >
                Đăng bài
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách bài viết hiện tại</h2>

          {posts.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-xl border border-gray-200 text-gray-500">
              Chưa có bài viết nào trong hệ thống.
            </div>
          ) : (
            posts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition hover:shadow"
              >
                {editingId === p.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border px-3 py-1.5 rounded text-sm w-full"
                        placeholder="Tiêu đề"
                      />
                      <input
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        className="border px-3 py-1.5 rounded text-sm w-full"
                        placeholder="Tác giả"
                      />
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="border px-3 py-1.5 rounded text-sm w-full"
                      rows={2}
                      placeholder="Nội dung"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleUpdate(p.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 font-medium"
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-400 font-medium"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-gray-900">{p.title}</h3>
                      <p className="text-xs text-indigo-600 font-medium">
                        Tác giả: {p.author}
                      </p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap mt-2">{p.content}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}