function openAddImportModal() {
    const productName = prompt("Enter product name:");
    const quantity = prompt("Enter quantity:");
    const importDate = prompt("Enter import date (YYYY-MM-DD):");
    if (productName && quantity && importDate) {
        addImport(productName, quantity, importDate);
    }
}

function addImport(productName, quantity, importDate) {
    const table = document.getElementById("import-list");
    const row = table.insertRow();
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = productName;
    row.insertCell(2).innerText = quantity;
    row.insertCell(3).innerText = importDate;
    const actions = row.insertCell(4);
    actions.innerHTML = '<button onclick="editImport(this)">Edit</button> <button onclick="deleteImport(this)">Delete</button>';
}

function editImport(btn) {
    const row = btn.parentNode.parentNode;
    const newProductName = prompt("Update product name:", row.cells[1].innerText);
    const newQuantity = prompt("Update quantity:", row.cells[2].innerText);
    const newImportDate = prompt("Update import date (YYYY-MM-DD):", row.cells[3].innerText);
    if (newProductName && newQuantity && newImportDate) {
        row.cells[1].innerText = newProductName;
        row.cells[2].innerText = newQuantity;
        row.cells[3].innerText = newImportDate;
    }
}

function deleteImport(btn) {
    if (confirm("Are you sure you want to delete this import record?")) {
        btn.parentNode.parentNode.remove();
    }
}
