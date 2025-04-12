// File: assets/js/menu-toggle.js

document.addEventListener("DOMContentLoaded", function () {
    // --- PHẦN TOGGLE MENU CHÍNH (Đã có) ---
    function setupMenuToggle() {
        const menuToggle = document.querySelector(".menu-toggle");
        const header = document.querySelector(".header");

        if (menuToggle && header) {
            console.log(
                "Menu toggle button and header found. Attaching listener."
            );
            menuToggle.addEventListener("click", function () {
                header.classList.toggle("menu-open");
                const isExpanded =
                    menuToggle.getAttribute("aria-expanded") === "true";
                menuToggle.setAttribute("aria-expanded", !isExpanded);

                // !! QUAN TRỌNG: Khi đóng menu chính, đóng luôn tất cả submenu đang mở
                if (!header.classList.contains("menu-open")) {
                    closeAllSubmenus();
                }
            });
        } else {
            console.warn(
                "Menu toggle button or header not found yet. Retrying in 100ms..."
            );
            setTimeout(setupMenuToggle, 100);
        }
    }

    // --- PHẦN MỚI: TOGGLE SUBMENU ---
    function setupSubmenuToggle() {
        // Tìm tất cả các LI trực tiếp trong menu chính MÀ CÓ chứa .drop-menu
        // Lưu ý: Selector :has() có thể không được hỗ trợ bởi trình duyệt rất cũ
        // Phương án thay thế: lặp qua tất cả li và kiểm tra querySelector('.drop-menu')
        const menuItemsWithSubmenu = document.querySelectorAll(
            ".header .menu > li:has(.drop-menu)"
        );

        if (menuItemsWithSubmenu.length > 0) {
            console.log("Found menu items with submenus. Attaching listeners.");
            menuItemsWithSubmenu.forEach((item) => {
                // Tìm link <a> con trực tiếp của li
                const link = item.querySelector(":scope > a"); // :scope chỉ tìm con trực tiếp

                if (link) {
                    link.addEventListener("click", function (event) {
                        // Chỉ ngăn chặn hành vi mặc định (nhảy tới #hash) KHI menu mobile đang mở
                        // Trên desktop, link vẫn hoạt động bình thường (nếu cần)
                        const header = document.querySelector(".header");
                        if (header && header.classList.contains("menu-open")) {
                            event.preventDefault(); // Ngăn nhảy link # trên mobile

                            // Đóng các submenu khác trước khi mở cái này (tùy chọn UX)
                            // closeAllSubmenus(item); // Truyền item hiện tại để không đóng chính nó

                            // Toggle class 'submenu-open' trên LI cha
                            item.classList.toggle("submenu-open");
                        }
                    });
                }
            });
        } else {
            // Có thể header chưa load xong, thử lại
            // console.warn("No submenus found yet. Retrying...");
            // setTimeout(setupSubmenuToggle, 150); // Cẩn thận vòng lặp vô hạn nếu selector sai
        }
    }

    // Hàm tiện ích để đóng tất cả các submenu đang mở
    function closeAllSubmenus(exceptThisItem = null) {
        const openSubmenus = document.querySelectorAll(
            ".header .menu li.submenu-open"
        );
        openSubmenus.forEach((item) => {
            if (item !== exceptThisItem) {
                item.classList.remove("submenu-open");
            }
        });
    }

    // --- GỌI CÁC HÀM SETUP ---
    setupMenuToggle();
    // Gọi setupSubmenuToggle sau một khoảng trễ nhỏ để đảm bảo header đã được load bởi footer.js
    // Hoặc gọi nó bên trong callback của includeHTML nếu bạn sửa footer.js
    setTimeout(setupSubmenuToggle, 50); // Đợi 50ms, có thể cần điều chỉnh
}); // Kết thúc DOMContentLoaded
