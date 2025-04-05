# Quản lý Cửa hàng Sách -Frontend (Bookstore Inventory)

Đây là giao diện người dùng (frontend) đơn giản được xây dựng bằng **HTML**, **CSS** và **JavaScript thuần** để kết nối với backend  **Minimal API (.NET 8)** cho hệ thống **quản lý kho**.

## 🌟 Chức năng chính

1. **Đăng nhập tài khoản**
   - Xác thực người dùng (Staff hoặc Admin)
   - Phân quyền truy cập theo vai trò

2. **Quản lý tài khoản (chỉ Admin)**
   - Xem danh sách tài khoản
   - Thêm/sửa/xóa tài khoản 

3. **Quản lý sách**
   - Danh sách sách
   - Thêm mới, chỉnh sửa hoặc xóa sách
   - Lọc sách theo danh mục

4. **Quản lý danh mục**
   - Hiển thị các loại sách 
   - Quản lý (thêm, sửa, xóa) danh mục sách

5. **Quản lý nhập kho**
   - Tạo phiếu nhập hàng
   - Cập nhật số lượng sách khi nhập

6. **Quản lý xuất kho**
   - Tạo phiếu xuất hàng
   - Cập nhật tồn kho

## 🔐 Tài khoản mẫu

| Vai trò  | Tên đăng nhập | Mật khẩu           |
|----------|---------------|--------------------|
| Staff    | `myngoc`      | `string`           |
| Admin    | `dangthithanh`| `hashed_password_7`|


## 🧰 Công nghệ sử dụng

- .NET 8.0
- C# 12.0
- MongoDB
- HTML/CSS/JavaScript
- Swagger/OpenAPI
- Docker

## 📁 Cấu trúc thư mục
frontend/
│
├── index.html                   # Trang đăng nhập chính
│
├── pages/                       # Thư mục chứa các trang giao diện
│   ├── dashboard.html           # Trang Dashboard (báo cáo tổng quan)
│   ├── admin.html               # Quản lý tài khoản (chỉ dành cho Admin)
│   ├── books.html               # Quản lý sách
│   ├── categories.html          # Quản lý danh mục sách
│   ├── imports.html             # Quản lý nhập kho
│   ├── exports.html             # Quản lý xuất kho
│
├── css/                         # Thư mục chứa các file CSS
│   ├── index.css                # Style cho trang đăng nhập
│   ├── dashboard.css            # Style cho dashboard
│   ├── admin.css                # Style cho quản lý tài khoản
│   ├── book.css                 # Style cho quản lý sách
│   ├── category.css             # Style cho quản lý danh mục
│   ├── import.css               # Style cho nhập kho
│   └── export.css               # Style cho xuất kho
│
├── js/                          # Thư mục chứa các file logic JS
│   ├── index.js                 # Xử lý đăng nhập, phân quyền
│   ├── dashboard.js             # Xử lý giao diện dashboard
│   ├── admin.js                 # Quản lý tài khoản (API, render)
│   ├── book.js                  # Quản lý sách
│   ├── category.js              # Quản lý danh mục
│   ├── import.js                # Quản lý nhập kho
│   └── export.js                # Quản lý xuất kho
│
├── images/                      # Tài nguyên tĩnh như ảnh, icon
│   └── (logo.png, icons.svg, ...)
│
└── README.md                    # Tài liệu mô tả dự án frontend

## 🚀 Hướng dẫn chạy dự án

1. **Khởi động backend**
   - Backend đã được deloy bằng render: https://bookstore-api-latest-h38r.onrender.com/swagger/index.html

2. **Cấu hình URL API**
   - Trong các file Config.js, cập nhật `baseUrl` để trỏ tới địa chỉ backend phù hợp.

3. **Mở giao diện frontend**
   - Mở `index.html` bằng trình duyệt để bắt đầu đăng nhập.
     
5. **Tiến hành quản lý**
   - Sau khi đăng nhập, điều hướng đến các module quản lý:
     - Tài khoản
     - Sách
     - Danh mục
     - Nhập kho
     - Xuất kho

## 📷 Giao diện mẫu
![image](https://github.com/user-attachments/assets/3e595b55-3691-4cb6-a25b-d893e0e34150)

## 👨‍💻 Tác giả

- **Dự án học tập** - Xây dựng hệ thống quản lý kho sử dụng Minimal API và frontend thuần
- Nhóm phát triển: GROUP4-SOA


