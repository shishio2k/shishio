// File: assets/js/menu-toggle.js
// Chứa logic để bật/tắt menu chính và các submenu.
// Hàm initializeMenuSystem sẽ được gọi bởi footer.js sau khi header.html được load.

/**
 * Hàm nội bộ: Thiết lập sự kiện click cho nút menu toggle chính.
 */
function setupMenuToggle() {
    // Tìm nút toggle và header *sau khi* header.html đã được chèn vào #header-placeholder
    const headerPlaceholder = document.getElementById("header-placeholder");
    const menuToggle = headerPlaceholder ? headerPlaceholder.querySelector(".menu-toggle") : null;
    const header = headerPlaceholder ? headerPlaceholder.querySelector(".header") : null;

    if (menuToggle && header) {
        console.log("Menu toggle button and header found by setupMenuToggle. Attaching listener.");
        menuToggle.addEventListener("click", function () {
            header.classList.toggle("menu-open"); // Thêm/xóa class để hiển thị/ẩn menu mobile
            // Cập nhật thuộc tính aria-expanded cho accessibility
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);

            // Khi đóng menu chính, đảm bảo đóng tất cả các submenu con
            if (!header.classList.contains("menu-open")) {
                closeAllSubmenus();
            }
        });
    } else {
        // Ghi lỗi nếu các thành phần cần thiết không tìm thấy khi hàm được gọi
        console.error("Could not setup menu toggle: Menu toggle button (.menu-toggle) or header element (.header) not found inside #header-placeholder.");
        if (!headerPlaceholder) console.error("-> Reason: #header-placeholder not found.");
        else if (!header) console.error("-> Reason: .header not found within #header-placeholder.");
        else if (!menuToggle) console.error("-> Reason: .menu-toggle not found (likely within the loaded header).");
    }
}

/**
 * Hàm nội bộ: Thiết lập sự kiện click cho các mục menu có submenu.
 */
function setupSubmenuToggle() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    const header = headerPlaceholder ? headerPlaceholder.querySelector(".header") : null;

    if (!header) {
        console.error("Could not setup submenu toggle: Header element (.header) not found inside #header-placeholder.");
        return;
    }

    // Tìm các thẻ LI trực tiếp trong .header .menu mà có chứa một .drop-menu con
    // Lưu ý: Selector :has() hoạt động tốt trên các trình duyệt hiện đại.
    const menuItemsWithSubmenu = header.querySelectorAll(".menu > li:has(.drop-menu)");

    if (menuItemsWithSubmenu.length > 0) {
        console.log(`Found ${menuItemsWithSubmenu.length} menu items with submenus. Attaching listeners.`);
        menuItemsWithSubmenu.forEach((item) => {
            // Tìm thẻ <a> là con trực tiếp của <li>
            const link = item.querySelector(":scope > a");

            if (link) {
                link.addEventListener("click", function (event) {
                    // Chỉ ngăn chặn hành vi mặc định (đi đến href="#") khi ở chế độ mobile (menu-open)
                    // Điều này cho phép click vào link cha để mở submenu trên mobile.
                    if (header.classList.contains("menu-open")) {
                        event.preventDefault(); // Ngăn chuyển trang hoặc nhảy đến #hash

                        // Tùy chọn: Đóng các submenu khác trước khi mở submenu này
                        // closeAllSubmenus(item); // Bỏ comment nếu muốn hành vi này

                        // Thêm/xóa class 'submenu-open' trên chính thẻ <li> cha
                        item.classList.toggle("submenu-open");
                    }
                    // Nếu không ở chế độ mobile (menu-open), link sẽ hoạt động bình thường (đi đến href).
                });
            } else {
                 // Cảnh báo nếu cấu trúc HTML không như mong đợi (LI có .drop-menu nhưng không có <a> con trực tiếp)
                 console.warn("Menu item LI found with .drop-menu, but no direct child link <a> found to attach toggle event.", item);
            }
        });
    } else {
        console.log("No menu items with submenus found in the loaded header.");
    }
}

/**
 * Hàm nội bộ tiện ích: Đóng tất cả các submenu đang có class 'submenu-open'.
 * @param {Element} [exceptThisItem=null] - (Tùy chọn) Thẻ LI không bị đóng.
 */
function closeAllSubmenus(exceptThisItem = null) {
    const headerPlaceholder = document.getElementById("header-placeholder");
    const header = headerPlaceholder ? headerPlaceholder.querySelector(".header") : null;
    if (!header) return; // Nếu không có header thì không làm gì cả

    const openSubmenus = header.querySelectorAll(".menu li.submenu-open");
    openSubmenus.forEach((item) => {
        // Chỉ đóng nếu nó không phải là item được loại trừ
        if (item !== exceptThisItem) {
            item.classList.remove("submenu-open");
        }
    });
}

/**
 * Hàm khởi tạo chính cho hệ thống menu.
 * Hàm này được đưa vào global scope (window) để footer.js có thể gọi nó
 * sau khi header.html đã được tải và chèn vào DOM.
 */
window.initializeMenuSystem = function() {
    console.log("Initializing menu system (toggle and submenus)...");
    // Gọi các hàm setup nội bộ
    setupMenuToggle();
    setupSubmenuToggle();
    console.log("Menu system initialization attempt finished.");
};

// --- Quan trọng: Không còn document.addEventListener('DOMContentLoaded') ở đây ---