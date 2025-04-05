// Check if CONFIG is loaded
console.log("API URL:", CONFIG.API_BASE_URL);

async function fetchCategories() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const categories = await response.json();

        const categoryListElement = document.getElementById('category-list');
        categoryListElement.innerHTML = '';

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>
                    <button class="edit-btn" onclick="openEditCategoryModal('${category.categoryId}')">Edit</button>
                    <button class="delete-btn" onclick="deleteCategory('${category.categoryId}')">Delete</button>
                </td>
            `;
            categoryListElement.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories');
    }
}

async function addCategory(categoryData) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: categoryData.name })
        });
        
        if (response.ok) {
            fetchCategories();
            alert('Category added successfully!');
            closeModal();
        } else {
            alert('Failed to add category!');
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category');
    }
}

async function updateCategory(categoryId, categoryData) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ 
                name: categoryData.name,
                description: 'Category description' // Required by API
            })
        });

        if (!response.ok) throw new Error('Failed to update category');
        alert('Category updated successfully!');
        fetchCategories();
        closeModal();
    } catch (error) {
        console.error('Error updating category:', error);
        alert('Failed to update category');
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete category');
        alert('Category deleted successfully!');
        fetchCategories();
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
    }
}

function openAddCategoryModal() {
    document.getElementById('add-category-modal').style.display = 'block';
}

function openEditCategoryModal(categoryId) {
    fetch(`${CONFIG.API_BASE_URL}categories/${categoryId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then(category => {
            const modal = document.getElementById('edit-category-modal');
            modal.style.display = 'block';

            // Only set category-specific fields
            document.getElementById('categoryId-edit').value = category.categoryId;
            document.getElementById('name-edit').value = category.name;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load category details');
        });
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
    });
}

// Form submit handlers
document.getElementById('add-category-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const categoryData = {
        name: e.target.name.value.trim()
    };

    if (!categoryData.name) {
        alert('Category name is required!');
        return;
    }

    addCategory(categoryData);
});

document.getElementById('edit-category-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const categoryId = document.getElementById('categoryId-edit').value;
    const categoryData = {
        name: document.getElementById('name-edit').value.trim()
    };

    if (!categoryData.name) {
        alert('Category name is required!');
        return;
    }

    updateCategory(categoryId, categoryData);
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link
    document.getElementById('category-link').classList.add('active');
    
    // Check login and role
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // Hide admin link for non-administrators
    const adminLink = document.getElementById('admin-link').parentElement;
    if (userRole !== '0' && userRole !== 'ADMINISTRATOR') {
        adminLink.style.display = 'none';
    }

    // Load initial data
    fetchCategories();
});