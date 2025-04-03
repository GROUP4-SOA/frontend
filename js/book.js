// Kiểm tra xem CONFIG đã được load chưa
console.log("API URL:", CONFIG.API_BASE_URL);


// Hàm lấy danh sách sách
async function fetchBooks() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}books`);
        const books = await response.json();

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
                <td>${book.categoryId}</td>
                <td>
                    <button onclick="openEditBookModal('${book.bookId}')">Edit</button>
                    <button onclick="deleteBook('${book.bookId}')">Delete</button>
                </td>
            `;
            bookListElement.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Hàm thêm sách mới
async function addBook(bookData) {
    try {
        const response = await fetch(API_BASE_URL, {
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
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        if (response.ok) {
            fetchBooks(); // Refresh book list
            alert('Book updated successfully!');
        } else {
            alert('Failed to update book!');
        }
    } catch (error) {
        console.error('Error updating book:', error);
    }
}

// Hàm xóa sách
async function deleteBook(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchBooks(); // Refresh book list
            alert('Book deleted successfully!');
        } else {
            alert('Failed to delete book!');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

// Hàm mở modal thêm sách
function openAddBookModal() {
    const modal = document.getElementById('add-book-modal');
    modal.style.display = 'block';
}

// Hàm mở modal chỉnh sửa sách
function openEditBookModal(bookId) {
    fetch(`${API_BASE_URL}/${bookId}`)
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

// Gọi hàm lấy danh sách sách khi trang được tải
window.onload = fetchBooks;
