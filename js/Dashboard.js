document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("dashboard-link").classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href").substring(1);

            if (page === "dashboard") {
                location.reload();
            } else {
                loadPage(page);
            }

            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

async function loadPage(page) {
    try {
        // Tải nội dung HTML của trang con
        const response = await fetch(`pages/${page}.html`);
        const html = await response.text();
        document.getElementById("content").innerHTML = html;

        // Xóa CSS cũ nếu có
        document.querySelectorAll("link[data-dynamic-css]").forEach(link => link.remove());

        // Thêm CSS mới nếu có
        const cssFile = `css/${page}.css`;
        fetch(cssFile, { method: "HEAD" })  // Kiểm tra file có tồn tại không
            .then(res => {
                if (res.ok) {
                    const link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = cssFile;
                    link.setAttribute("data-dynamic-css", "true");
                    document.head.appendChild(link);
                }
            });

        // Xóa JS cũ nếu có
        document.querySelectorAll("script[data-dynamic-js]").forEach(script => script.remove());

        // Thêm JS mới nếu có
        const jsFile = `js/${page}.js`;
        fetch(jsFile, { method: "HEAD" })  // Kiểm tra file có tồn tại không
            .then(res => {
                if (res.ok) {
                    const script = document.createElement("script");
                    script.src = jsFile;
                    script.setAttribute("data-dynamic-js", "true");
                    document.body.appendChild(script);
                }
            });

    } catch (error) {
        console.error("Error loading page:", error);
        document.getElementById("content").innerHTML = "<p>Error loading content.</p>";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    // Sample data
    const importData = [50, 75, 120, 95, 130, 170, 200, 185, 220, 250, 230, 280];
    const exportData = [40, 60, 90, 80, 110, 140, 180, 160, 200, 220, 210, 260];
    const categories = ["Novel", "Science", "History", "Textbook", "Comics"];
    const categoryData = [40, 30, 15, 25, 35];

    // Bar chart - Books imported by month
    new Chart(document.getElementById("importChart"), {
        type: "bar",
        data: {
            labels: ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: "Books Imported",
                data: importData,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });

    // Pie chart - Book categories distribution
    new Chart(document.getElementById("categoryChart"), {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                label: "Book Quantity",
                data: categoryData,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"]
            }]
        },
        options: { responsive: true }
    });

    // Line chart - Export trends by month
    new Chart(document.getElementById("exportChart"), {
        type: "line",
        data: {
            labels: ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"],
            datasets: [{
                label: "Books Exported",
                data: exportData,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
});

// Handle Logout
document.getElementById("logout-btn").addEventListener("click", function(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to log out?")) {
        window.location.href = "login.html";
    }
});
