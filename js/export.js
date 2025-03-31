function openAddExportModal() {
    const productName = prompt("Enter product name:");
    const quantity = prompt("Enter quantity:");
    const exportDate = prompt("Enter export date (YYYY-MM-DD):");
    if (productName && quantity && exportDate) {
        addExport(productName, quantity, exportDate);
    }
}

function addExport(productName, quantity, exportDate) {
    const table = document.getElementById("export-list");
    const row = table.insertRow();
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = productName;
    row.insertCell(2).innerText = quantity;
    row.insertCell(3).innerText = exportDate;
    const actions = row.insertCell(4);
    actions.innerHTML = '<button onclick="editExport(this)">Edit</button> <button onclick="deleteExport(this)">Delete</button>';
}

function editExport(btn) {
    const row = btn.parentNode.parentNode;
    const newProductName = prompt("Update product name:", row.cells[1].innerText);
    const newQuantity = prompt("Update quantity:", row.cells[2].innerText);
    const newExportDate = prompt("Update export date (YYYY-MM-DD):", row.cells[3].innerText);
    if (newProductName && newQuantity && newExportDate) {
        row.cells[1].innerText = newProductName;
        row.cells[2].innerText = newQuantity;
        row.cells[3].innerText = newExportDate;
    }
}

function deleteExport(btn) {
    if (confirm("Are you sure you want to delete this export record?")) {
        btn.parentNode.parentNode.remove();
    }
}