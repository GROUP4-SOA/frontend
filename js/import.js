// Kiểm tra URL cấu hình
console.log("API URL:", CONFIG.API_BASE_URL);

// Hàm tải danh sách phiếu nhập
async function loadImports() {
    try {
        const [importResponse, booksResponse, usersResponse] = await Promise.all([
            fetch(`${CONFIG.API_BASE_URL}imports`),
            fetch(`${CONFIG.API_BASE_URL}books`),
            fetch(`${CONFIG.API_BASE_URL}auth/users`)
        ]);

        if (!importResponse.ok || !booksResponse.ok || !usersResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const imports = await importResponse.json();
        const books = await booksResponse.json();
        const users = await usersResponse.json();

        const bookMap = {};
        books.forEach(book => {
            bookMap[book.bookId] = book.title;
        });

        const userMap = {};
        users.forEach(user => {
            userMap[user.userId] = user.fullName;
        });

        const importList = document.getElementById("import-list");
        importList.innerHTML = '';

        imports.forEach(WarehouseImport => {
            const row = document.createElement('tr');

            const bookDetails = WarehouseImport.warehouseImportBooks.map(book => {
                const title = bookMap[book.bookId] || "Unknown Title";
                return `<div><strong>${title}</strong></div><hr style="margin: 4px 0;">`;
            }).join('');

            const importQuantities = WarehouseImport.warehouseImportBooks
                .map(book => book.importQuantity)
                .join('<hr style="margin: 4px 0;">');

            const prices = WarehouseImport.warehouseImportBooks
                .map(book => book.price)
                .join('<hr style="margin: 4px 0;">');

            const importerName = userMap[WarehouseImport.userId] || "Unknown User";

            row.innerHTML = `
                <td>${WarehouseImport.importId}</td>
                <td>${bookDetails}</td>
                <td>${importQuantities}</td>
                <td>${prices}</td>
                <td>${importerName}</td>
                <td>${new Date(WarehouseImport.importDate).toLocaleDateString()}</td>
            `;

            importList.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading imports:', error);
    }
}

// Hàm mở modal thêm phiếu nhập
window.openAddImportModal = async function () {
    const [booksResponse, usersResponse] = await Promise.all([
        fetch(`${CONFIG.API_BASE_URL}books`),
        fetch(`${CONFIG.API_BASE_URL}auth/users`)
    ]);

    const books = await booksResponse.json();
    const users = await usersResponse.json();

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add Import Record</h2>
            <form id="add-import-form">
                <label for="book-id">Book IDs</label>
                <select id="book-id" name="book-ids[]" multiple required style="height: 120px;">
                ${books.map(book => `   
                    <option value="${book.bookId}">
                        ${book.bookId} - ${book.title} (Stock: ${book.quantity})
                    </option>`).join('')}
                </select>

                <div id="book-details-container"></div>

                <label for="user-id">Importer ID</label>
                <select id="user-id" name="user-id" required>
                    <option value="">-- Select User ID --</option>
                    ${users.map(user => `<option value="${user.userId}">${user.userId} - ${user.fullName}</option>`).join('')}
                </select>

                <label for="import-date">Import Date</label>
                <input type="date" id="import-date" name="import-date" required>

                <button class="save-btn" type="submit">Save Import</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "block";

    const closeButton = modal.querySelector('.close');
    closeButton.onclick = () => { modal.remove(); };
    window.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    const bookSelect = modal.querySelector('#book-id');
    const bookDetailsContainer = modal.querySelector('#book-details-container');

    bookSelect.addEventListener('change', () => {
        const selectedBookIds = Array.from(bookSelect.selectedOptions).map(opt => opt.value);
        bookDetailsContainer.innerHTML = '';

        selectedBookIds.forEach(bookId => {
            const selectedBook = books.find(b => b.bookId === bookId);
            const price = selectedBook ? selectedBook.price : 0;

            const div = document.createElement('div');
            div.classList.add('book-detail-row');
            div.innerHTML = `
                <h4>Book ID: ${bookId}</h4>
                <label>Quantity:</label>
                <input type="number" class="quantity-input" data-bookid="${bookId}" required>
                <label>Price:</label>
                <input type="number" class="price-input" value="${price}" data-bookid="${bookId}" required>
                <hr>
            `;
            bookDetailsContainer.appendChild(div);
        });
    });

    document.getElementById('add-import-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const importDate = document.getElementById('import-date').value;
        const userId = document.getElementById('user-id').value;

        const quantities = modal.querySelectorAll('.quantity-input');
        const prices = modal.querySelectorAll('.price-input');

        const WarehouseImportBooks = Array.from(quantities).map((qtyInput, index) => {
            const bookId = qtyInput.getAttribute('data-bookid');
            const quantity = qtyInput.value;
            const price = prices[index].value;

            return {
                BookId: bookId,
                ImportQuantity: quantity,
                Price: price
            };
        });

        const importData = {
            ImportDate: importDate,
            UserId: userId,
            WarehouseImportBooks
        };

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}imports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(importData)
            });

            if (response.ok) {
                alert('Import added successfully');
                modal.remove();
                loadImports();
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error adding import:', error);
            alert('Error adding import');
        }
    });
};


//NavigationNavigation
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("import-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "import") {
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

// Khởi chạy khi trang load
window.onload = loadImports;

