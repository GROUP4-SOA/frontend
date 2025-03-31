function openAddBookModal() {
    const bookName = prompt("Enter book name:");
    const category = prompt("Enter category:");
    const author = prompt("Enter author:");
    if (bookName && category && author) {
        addBook(bookName, category, author);
    }
}

function addBook(name, category, author) {
    const table = document.getElementById("book-list");
    const row = table.insertRow();
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = name;
    row.insertCell(2).innerText = category;
    row.insertCell(3).innerText = author;
    const actions = row.insertCell(4);
    actions.innerHTML = '<button onclick="editBook(this)">Edit</button> <button onclick="deleteBook(this)">Delete</button>';
    updateCategoryFilter();
}

function editBook(btn) {
    const row = btn.parentNode.parentNode;
    const newName = prompt("Update book name:", row.cells[1].innerText);
    const newCategory = prompt("Update category:", row.cells[2].innerText);
    const newAuthor = prompt("Update author:", row.cells[3].innerText);
    if (newName && newCategory && newAuthor) {
        row.cells[1].innerText = newName;
        row.cells[2].innerText = newCategory;
        row.cells[3].innerText = newAuthor;
        updateCategoryFilter();
    }
}

function deleteBook(btn) {
    if (confirm("Are you sure you want to delete this book?")) {
        btn.parentNode.parentNode.remove();
    }
}

function updateCategoryFilter() {
    const categories = new Set();
    document.querySelectorAll("#book-list tr td:nth-child(3)").forEach(td => categories.add(td.innerText));
    const filter = document.getElementById("category-filter");
    filter.innerHTML = '<option value="all">All</option>' + Array.from(categories).map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function filterBooks() {
    const selectedCategory = document.getElementById("category-filter").value;
    document.querySelectorAll("#book-list tr").forEach(row => {
        row.style.display = (selectedCategory === "all" || row.cells[2].innerText === selectedCategory) ? "" : "none";
    });
}