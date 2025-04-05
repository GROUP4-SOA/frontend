document.addEventListener('DOMContentLoaded', function() {
    // Role check
    const userRole = localStorage.getItem('role');
    if (userRole !== '0' && userRole !== 'ADMINISTRATOR') {
        window.location.href = 'Dashboard.html';
        return;
    }

    // Setup navigation
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Set active state for admin link
    document.getElementById('admin-link').classList.add('active');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').replace('#', '');
            
            switch(page) {
                case 'dashboard':
                    window.location.href = 'Dashboard.html';
                    break;
                case 'admin':
                    location.reload();
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

    // Load user data
    fetchUsers();

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '../index.html';
    });
});

// Kiểm tra xem CONFIG đã được load chưa
console.log("API URL:", CONFIG.API_BASE_URL);

// Lấy danh sách người dùng từ API
async function fetchUsers() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}auth/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const users = await response.json();
        console.log('Users:', users); // Debug log
   const accountList = document.getElementById('account-list');
        accountList.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.userId}</td>
                <td>${user.fullName}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.phoneNo}</td>
                <td>${user.role === 0 ? 'ADMINISTRATOR' : 'STAFF'}</td>
                <td>${user.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                    <button class="edit-btn" onclick="openEditAccountModal('${user.userId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteUser('${user.userId}')">
                        ${user.isActive ? 'Disable' : 'Enable'}
                    </button>
                </td>
            `;
            accountList.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again.');
    }
}

// Thêm người dùng
async function addUser(user) {
    try {
        // Gửi yêu cầu POST với dữ liệu người dùng
        const response = await fetch(`${CONFIG.API_BASE_URL}users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user), // Chuyển đối tượng thành chuỗi JSON
        });

        if (response.ok) {
            fetchUsers(); // Làm mới danh sách người dùng sau khi thêm
            alert('User added successfully!');
        } else {
            alert('Failed to add user!');
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

// Cập nhật người dùng
async function updateUser(userId, updatedUser) {
    try {
        const response = await fetch(CONFIG.API_BASE_URL + `auth/${userId}`, {  // Chỉnh sửa API URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });
        if (!response.ok) throw new Error('Failed to update user');
        alert('Cập nhật sách thành công!');
        fetchUser();
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Đã xảy ra lỗi khi cập nhật người dùng.');
    }
}


// Xóa người dùng
async function deleteUser(userId) {
    // Tìm user hiện tại
    const user = findUserById(userId);

    // Nếu không tìm thấy user
    if (!user) {
        console.error('Không tìm thấy người dùng.');
        return;
    }

    // Nếu user đã bị vô hiệu hóa
    if (user.isActive = false) {
        alert("Người dùng đã bị vô hiệu hóa.");
        console.log("User:", user);
        return;
    }
    
    // Xác nhận trước khi vô hiệu hóa
    const confirmDelete = confirm("Bạn có chắc muốn vô hiệu hóa người dùng này?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(CONFIG.API_BASE_URL + `auth/deactivate/${userId}`, {
            method: 'PUT',
        });

        if (response.ok) {
            fetchUsers(); // Làm mới danh sách sau khi xóa
        } else {
            console.error('Failed to deactivate user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Mở modal thêm người dùng
function openAddAccountModal() {
    const modal = document.getElementById('add-account-modal');
    modal.style.display = 'block';
}

// Mở modal sửa thông tin người dùng
function openEditAccountModal(userId) {
    fetch(CONFIG.API_BASE_URL + `auth/${userId}`)
        .then(response => response.json())
        .then(user => {
            const modal = document.getElementById('edit-account-modal');
            modal.style.display = 'block';

            // Điền dữ liệu vào form
    document.getElementById('userId-edit').value = user.userId;
    document.getElementById('username-edit').value = user.username;
    document.getElementById('fullName-edit').value = user.fullName;
    document.getElementById('email-edit').value = user.email;
    document.getElementById('phone-edit').value = user.phoneNo;
    document.getElementById('role-edit').value = user.role;
    document.getElementById('isActive-edit').checked = user.isActive;
        });
}
// Hàm tìm user theo ID
function findUserById(userId) {
    const rows = document.querySelectorAll("#account-list tr");
    for (let row of rows) {
        if (row.children[0].innerText === userId) {
            return {
                userId: row.children[0].innerText,
                fullName: row.children[1].innerText,
                username: row.children[2].innerText,
                email: row.children[3].innerText,
                phoneNo: row.children[4].innerText,
                role: row.children[5].innerText,
                isActive: row.children[6].innerText === 'true'
            };
        }
    }
    return null;
}
// Đóng modal
function closeModal() {
    const modal = document.querySelectorAll('.modal');
    modal.forEach(modal => modal.style.display = 'none');
}
// Sự kiện gửi form để thêm người dùng
document.getElementById('add-account-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Ngừng hành động mặc định của form

    // Lấy dữ liệu từ form và chuyển đổi thành đối tượng đúng format
    const user = {
        username: e.target.username.value,   // Đảm bảo tên trường đúng với API yêu cầu
        password: e.target.password.value,   // Thêm mật khẩu
        fullName: e.target.fullName.value,
        email: e.target.email.value,
        phoneNo: e.target.phone.value,      // Dùng phoneNo thay vì PhoneNo
        role: parseInt(e.target.role.value), // Chuyển giá trị role từ string sang number
        isActive: e.target.isActive.checked  // Dùng .checked để lấy giá trị true/false cho checkbox
    };

    // Gọi hàm thêm người dùng
    addUser(user);

    // Đóng modal sau khi gửi form
    closeModal();
});


// Sự kiện gửi form sửa người dùng
document.getElementById('edit-account-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const userId = e.target.userId.value;
    const updatedUser = {
        fullName: e.target.fullName.value,
        username: e.target.username.value,
        email: e.target.email.value,
        phoneNo: e.target.phone.value,
        role: e.target.role.value,
        isActive: e.target.isActive.checked  // Đảm bảo lấy giá trị đúng
    };

    console.log("Updating user:", userId, updatedUser); // Kiểm tra dữ liệu trước khi gửi API
    updateUser(userId, updatedUser);
    closeModal();
});


//NavigationNavigation
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("admin-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "admin") {
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
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('href').replace('#', '');

            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Handle navigation based on clicked link
            switch (page) {
                case 'dashboard':
                    window.location.href = 'Dashboard.html';
                    break;
                case 'admin':
                    window.location.href = 'admin.html';
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
    document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        // Clear localStorage
        localStorage.clear();
        // Redirect to login page
        window.location.href = '../index.html';
    });
});

// Lấy danh sách người dùng khi tải trang
window.onload = function () {
    fetchUsers();
};

