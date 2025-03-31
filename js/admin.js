function openAddAccountModal() {
    const username = prompt("Enter username:");
    const email = prompt("email:");
    const role = prompt("(admin/staff):").toLowerCase();
    
    if (username && email && (role === "admin" || role === "staff")) {
        addAccount(username, email, role);
    } else {
        alert("Account type can only be 'admin' or 'staff'.");
    }
}

function addAccount(username, email, role) {
    const table = document.getElementById("account-list");
    const row = table.insertRow();
    row.insertCell(0).innerText = table.rows.length;
    row.insertCell(1).innerText = username;
    row.insertCell(2).innerText = email;
    row.insertCell(3).innerText = role.charAt(0).toUpperCase() + role.slice(1); // Viết hoa chữ cái đầu
    const actions = row.insertCell(4);
    actions.innerHTML = '<button onclick="editAccount(this)">EditEdit</button> <button onclick="deleteAccount(this)">DeleteDelete</button>';
}

function editAccount(btn) {
    const row = btn.parentNode.parentNode;
    const newUsername = prompt("Update login name:", row.cells[1].innerText);
    const newEmail = prompt("Update email:", row.cells[2].innerText);
    const newRole = prompt("Update account type (admin/staff):", row.cells[3].innerText.toLowerCase());

    if (newUsername && newEmail && (newRole === "admin" || newRole === "staff")) {
        row.cells[1].innerText = newUsername;
        row.cells[2].innerText = newEmail;
        row.cells[3].innerText = newRole.charAt(0).toUpperCase() + newRole.slice(1);
    } else {
        alert("Account type can only be 'admin' or 'staff'.");
    }
}

function deleteAccount(btn) {
    if (confirm("Are you sure you want to delete this account?")) {
        btn.parentNode.parentNode.remove();
    }
}
