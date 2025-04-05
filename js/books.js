// Kiểm tra xem CONFIG đã được load chưa
console.log("API URL:", CONFIG.API_BASE_URL);

// Hàm lấy danh sách sách và categories cùng lúc
async function fetchBooks() {
    try {
        // Fetch books và categories cùng lúc
        const [booksResponse, categoriesResponse] = await Promise.all([
            fetch(`${CONFIG.API_BASE_URL}books`),
            fetch(`${CONFIG.API_BASE_URL}categories`)  // Fetching the categories
        ]);

        if (!booksResponse.ok || !categoriesResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const books = await booksResponse.json();
        const categories = await categoriesResponse.json();

        // Tạo map từ categoryId -> name
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.categoryId] = category.name;
        });

        // Cập nhật các tùy chọn lọc category
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="all">All</option>'; // Clear current options

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryId;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });

        const bookListElement = document.getElementById('book-list');
        bookListElement.innerHTML = ''; // Clear current list

        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.bookId}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.price}</td>
                <td>${book.quantity}</td>
                <td>${categoryMap[book.categoryId] || "Unknown Category"}</td> <!-- Show category name instead of ID -->
                <td>
                    <button class="edit-btn" onclick="openEditBookModal('${book.bookId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteBook('${book.bookId}')">Delete</button>
                </td>
            `;
            bookListElement.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Hàm lọc sách theo category và các filter khác
async function filterBooks() {
    const categoryId = document.getElementById('category-filter').value;

    try {
        // Fetching books based on selected category
        const response = await fetch(`${CONFIG.API_BASE_URL}books/category/${categoryId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        const books = await response.json();

        // Fetching categories to create categoryMap
        const categoriesResponse = await fetch(`${CONFIG.API_BASE_URL}categories`);
        if (!categoriesResponse.ok) {
            throw new Error('Failed to fetch categories');
        }
        const categories = await categoriesResponse.json();

        // Create category map from categoryId -> name
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.categoryId] = category.name;
        });

        const bookListElement = document.getElementById('book-list');
        bookListElement.innerHTML = ''; // Clear current list

        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.bookId}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.price}</td>
                <td>${book.quantity}</td>
                <td>${categoryMap[book.categoryId] || "Unknown Category"}</td> <!-- Show category name -->
                <td>
                    <button class="edit-btn" onclick="openEditBookModal('${book.bookId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteBook('${book.bookId}')">Delete</button>
                </td>
            `;
            bookListElement.appendChild(row);
        });
    } catch (error) {
        console.error('Error filtering books:', error);
    }
}


// Hàm thêm sách mới
async function addBook(bookData) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        if (response.ok) {
            fetchBooks(); // Refresh book list
            alert('Book added successfully!');
        } else {
            alert('Failed to add book!');
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

// Hàm sửa thông tin sách
async function updateBook(bookId, bookData) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}books/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) throw new Error('Failed to update book');
        alert('Cập nhật sách thành công!');
        fetchBooks();
    } catch (error) {
        console.error('Lỗi khi cập nhật sách:', error);
        alert('Lỗi khi cập nhật sách!');
    }
}
// Hàm mở modal chỉnh sửa sách
function openEditBookModal(bookId) {
    fetch(`${CONFIG.API_BASE_URL}books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            const modal = document.getElementById('edit-book-modal');
            modal.style.display = 'block';

            document.getElementById('edit-book-id').value = book.bookId;
            document.getElementById('edit-title').value = book.title;
            document.getElementById('edit-author').value = book.author;
            document.getElementById('edit-price').value = book.price;
            document.getElementById('edit-quantity').value = book.quantity;
            document.getElementById('edit-category').value = book.categoryId;
        });
}

// Hàm xóa sách với xác nhận
async function deleteBook(bookId) {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sách này?");
    
    if (confirmDelete) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}books/${bookId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete book');
            alert('Xóa sách thành công!');
            fetchBooks();
        } catch (error) {
            console.error('Lỗi khi xóa sách:', error);
            alert('Lỗi khi xóa sách!');
        }
    } else {
        // Nếu người dùng không xác nhận, không làm gì cả
        console.log('Xóa sách bị hủy');
    }
}


// Hàm mở modal thêm sách
function openAddBookModal() {
    const modal = document.getElementById('add-book-modal');
    modal.style.display = 'block';
}


// Hàm đóng modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

// Hàm thêm sách từ modal
function handleAddBookSubmit(event) {
    event.preventDefault();
    
    const bookData = {
        title: event.target.title.value,
        author: event.target.author.value,
        price: parseFloat(event.target.price.value),
        categoryId: event.target.categoryId.value,
        quantity: parseInt(event.target.quantity.value),
    };

    addBook(bookData);
    closeModal();
}

// Hàm cập nhật sách từ modal
function handleEditBookSubmit(event) {
    event.preventDefault();

    const bookId = event.target.bookId.value;
    const bookData = {
        title: event.target.title.value,
        author: event.target.author.value,
        price: parseFloat(event.target.price.value),
        categoryId: event.target.categoryId.value,
        quantity: parseInt(event.target.quantity.value),
    };

    updateBook(bookId, bookData);
    closeModal();
}

//NavigationNavigation
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("books-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "books") {
                location.reload();
            } else {
                loadPage(page);
            }

            // Cập nhật class active
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').replace('#', '');
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle navigation based on clicked link
            switch(page) {
                case 'dashboard':
                    window.location.href = 'Dashboard.html';
                    break;
                case 'admin':
                    window.location.href = 'admin.html';
                    break;
                    case 'category':
                    window.location.href = 'category.html';
                    break;
                case 'books':
                    window.location.href = 'books.html';
                    break;
                case 'import':
                    window.location.href = 'import.html';
                    break;
                case 'export':
                    window.location.href = 'export.html';
                    break;
            }
        });
    });

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        // Clear localStorage
        localStorage.clear();
        // Redirect to login page
        window.location.href = '../index.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Check user role and hide admin link
    const userRole = localStorage.getItem('role');
    const adminLink = document.getElementById('admin-link').parentElement;
    
    // Hide admin link for non-administrators
    if (userRole !== '0' && userRole !== 'ADMINISTRATOR') {
        adminLink.style.display = 'none';
    }

    // Prevent non-admin access
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#admin' && 
                (userRole !== '0' && userRole !== 'ADMINISTRATOR')) {
                e.preventDefault();
                alert('Access denied. Administrator privileges required.');
                return;
            }
        });
    });

    // Verify login status
    if (!localStorage.getItem('token')) {
        window.location.href = '../index.html';
        return;
    }
});

// Gọi hàm lấy danh sách sách khi trang được tải
window.onload = fetchBooks;
