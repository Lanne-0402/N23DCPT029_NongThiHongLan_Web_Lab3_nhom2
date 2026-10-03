const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const DATA_PATH = path.join(__dirname, 'data.json');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

async function readPosts() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writePosts(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi đọc dữ liệu bài viết' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ Tiêu đề, Nội dung và Tác giả!' });
    }

    const posts = await readPosts();
    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    await writePosts(posts);

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lưu bài viết mới' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content, author } = req.body;

    const posts = await readPosts();
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết cần sửa' });
    }

    posts[index] = {
      ...posts[index],
      title: title !== undefined ? title.trim() : posts[index].title,
      content: content !== undefined ? content.trim() : posts[index].content,
      author: author !== undefined ? author.trim() : posts[index].author
    };

    await writePosts(posts);
    res.json(posts[index]);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi cập nhật bài viết' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const posts = await readPosts();
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết để xoá' });
    }

    posts.splice(index, 1);
    await writePosts(posts);

    res.json({ message: 'Đã xoá thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi xoá bài viết' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend chạy tại port :${PORT}`);
});