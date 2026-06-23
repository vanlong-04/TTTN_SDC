# Deployment Guide

## Backend (Render hoặc Node host tương đương)

Root directory: `backend`

```text
Build Command: npm ci
Start Command: npm start
```

Khai báo biến môi trường:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/it_interview_mock_test
JWT_SECRET=<random-secret-dai-va-manh>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.example
ADMIN_USERNAME=<admin-name>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<strong-password>
DEMO_USER_PASSWORD=<strong-demo-password>
```

Không đưa giá trị thật vào Git. Sau deploy có thể chạy one-off command `npm run seed` và `npm run seed:admin` nếu cần dữ liệu demo.

## MongoDB Atlas

Tạo database user với quyền tối thiểu cần thiết, giới hạn Network Access theo hạ tầng deploy nếu có thể, lấy connection string `mongodb+srv://...` và gán vào `MONGO_URI`.

## Frontend (Vercel hoặc static host)

Root directory: `frontend`

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Khai báo:

```env
VITE_API_URL=https://your-backend.example/api
```

Với SPA routing, cấu hình rewrite mọi route không phải asset về `/index.html`. Thêm chính xác domain frontend vào `CLIENT_URL` backend; nhiều origin được phân tách bằng dấu phẩy.

## Kiểm tra sau deploy

1. Gọi `GET /` backend và kiểm tra JSON health response.
2. Đăng ký user, xác nhận role là `user`.
3. Login và mở `/quizzes`, `/quiz/:quizId`, thử reload.
4. Nộp bài và xem history.
5. Login admin, kiểm tra CRUD và review.
6. Kiểm tra CORS, rate-limit và không có stack trace trong lỗi production.
