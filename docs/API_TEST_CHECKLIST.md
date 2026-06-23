# API Test Checklist

Thiết lập `baseUrl=http://localhost:5000/api`, lưu JWT user/admin sau khi login và gửi bằng `Authorization: Bearer <token>`.

## Auth

- [ ] `POST /auth/register` hợp lệ trả 201 và role luôn là `user`.
- [ ] Gửi `role: "admin"` khi register trả 400.
- [ ] Email sai định dạng hoặc password dưới 6 ký tự trả 400.
- [ ] `POST /auth/login` trả token với thông tin đúng; sai mật khẩu trả 401.
- [ ] `GET /auth/me` thiếu token trả 401.

## Questions

- [ ] `GET /questions/bank` chỉ trả câu published.
- [ ] Admin tạo/sửa/xóa câu hỏi thành công.
- [ ] User thường tạo/sửa/xóa nhận 403.
- [ ] Thiếu content, correctAnswer, tags hoặc lựa chọn trắc nghiệm nhận 400 và `details` theo field.

## Quizzes

- [ ] `GET /quizzes/public` chỉ trả đề published.
- [ ] `GET /quizzes/public/:id` không chứa `correctAnswer` hoặc `explanation`.
- [ ] Reload `/quiz/:quizId` tải lại được đề.
- [ ] Generate kiểm tra tag, questionCount 1–50 và duration 1–240.
- [ ] Chỉ admin được tạo/sửa/xóa đề thủ công.

## Submissions và Admin

- [ ] Submit kiểm tra ObjectId, answers và chấm đúng câu multiple choice.
- [ ] Bài có short answer chuyển `pending_review`.
- [ ] User chỉ xem được submission của mình; truy cập bài người khác trả 403.
- [ ] User thường gọi `/admin/*` nhận 403.
- [ ] Admin xem dashboard, danh sách, chi tiết và review bài thành công.

## Security

- [ ] Response có security headers của Helmet và không có `X-Powered-By`.
- [ ] Origin ngoài `CLIENT_URL` bị CORS từ chối.
- [ ] Query chứa `$` hoặc key có dấu chấm nhận 400.
- [ ] Request JSON trên 10 KB nhận 413.
- [ ] Rate limit trả 429 sau khi vượt ngưỡng.
- [ ] Response production không chứa stack trace.
