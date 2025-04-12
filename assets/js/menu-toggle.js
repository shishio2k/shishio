// File: assets/js/menu-toggle.js

// Đảm bảo script chỉ chạy sau khi toàn bộ DOM đã được tải
document.addEventListener("DOMContentLoaded", function () {
    // Tìm nút toggle và header SAU KHI header.html đã được tải vào placeholder
    // Chúng ta cần đảm bảo header đã tồn tại trong DOM
    // Cách an toàn nhất là đợi một chút hoặc chạy code này sau khi includeHTML hoàn tất
    // Tuy nhiên, DOMContentLoaded thường đủ nếu includeHTML chạy đồng bộ hoặc đủ nhanh.

    // Hàm để thiết lập event listener cho menu toggle
    function setupMenuToggle() {
        const menuToggle = document.querySelector(".menu-toggle");
        const header = document.querySelector(".header"); // Phần tử header chứa cả nút và menu

        // Kiểm tra xem các phần tử đã tồn tại chưa (quan trọng vì header được load động)
        if (menuToggle && header) {
            console.log(
                "Menu toggle button and header found. Attaching listener."
            );
            menuToggle.addEventListener("click", function () {
                // Toggle class 'menu-open' trên phần tử header
                header.classList.toggle("menu-open");

                // Cập nhật trạng thái aria-expanded cho accessibility
                const isExpanded =
                    menuToggle.getAttribute("aria-expanded") === "true";
                menuToggle.setAttribute("aria-expanded", !isExpanded);
            });
        } else {
            // Nếu chưa tìm thấy, thử lại sau một khoảng thời gian ngắn
            // Điều này hữu ích nếu việc tải header.html hơi chậm
            console.warn(
                "Menu toggle button or header not found yet. Retrying in 100ms..."
            );
            setTimeout(setupMenuToggle, 100);
        }
    }

    // Gọi hàm thiết lập lần đầu
    setupMenuToggle();
});
