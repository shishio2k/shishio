// File: assets/js/menu-toggle.js
// Handles main menu toggle and nested submenu toggles (+/- buttons) for mobile view.

/**
 * Hàm nội bộ: Đóng tất cả các submenu đang mở (có class 'active') bên trong header.
 * Được sử dụng khi đóng menu chính hoặc tùy chọn khi mở một submenu khác.
 * @param {Element} header - Phần tử header chính chứa menu.
 * @param {Element} [exceptThisDropdown=null] - (Tùy chọn) Một UL dropdown không bị đóng.
 */
function closeAllSubmenus(header, exceptThisDropdown = null) {
    if (!header) return;
    // Tìm tất cả các UL dropdown đang active
    const openDropdowns = header.querySelectorAll('.menu ul.active'); // Tìm tất cả ul.active trong .menu
    openDropdowns.forEach(dropdown => {
        if (dropdown !== exceptThisDropdown) {
            dropdown.classList.remove('active');
            // Tìm LI cha và cập nhật nút toggle tương ứng (nếu có)
            const liParent = dropdown.closest('li');
            if (liParent) {
                const toggleButton = liParent.querySelector(':scope > .submenu-toggle');
                if (toggleButton) {
                    toggleButton.textContent = '+';
                    toggleButton.classList.remove('open');
                }
            }
        }
    });
}

/**
 * Hàm nội bộ: Thiết lập sự kiện click cho nút menu toggle chính (hamburger).
 * @param {Element} headerPlaceholder - Phần tử chứa header được load.
 */
function setupMainMenuToggle(headerPlaceholder) {
    const menuToggle = headerPlaceholder.querySelector(".menu-toggle");
    const header = headerPlaceholder.querySelector(".header");

    if (menuToggle && header) {
        // console.log("Attaching main menu toggle listener."); // Debug log
        menuToggle.addEventListener("click", function () {
            const isOpening = !header.classList.contains("menu-open");
            header.classList.toggle("menu-open"); // Toggle class trên header
            menuToggle.setAttribute("aria-expanded", isOpening); // Cập nhật ARIA state

            // Khi đóng menu chính, đóng tất cả submenu con
            if (!isOpening) {
                closeAllSubmenus(header);
            }
        });
    } else {
        console.error("Could not setup main menu toggle: .menu-toggle or .header not found in #header-placeholder.");
    }
}

/**
 * Hàm nội bộ: Thiết lập sự kiện click cho TẤT CẢ các mục menu có submenu lồng nhau.
 * Sẽ thêm nút +/- và xử lý việc mở/đóng submenu.
 * @param {Element} headerPlaceholder - Phần tử chứa header được load.
 */
function setupNestedSubmenuToggles(headerPlaceholder) {
    const header = headerPlaceholder.querySelector(".header");
    if (!header) {
        console.error("Could not setup submenu toggles: .header not found in #header-placeholder.");
        return;
    }

    // Tìm tất cả các thẻ LI bên trong .menu mà có một thẻ UL con trực tiếp
    // Selector :scope > ul đảm bảo chỉ chọn UL con trực tiếp (drop-menu hoặc sub-drop-menu)
    const itemsWithDropdown = header.querySelectorAll(".menu li:has(> ul)");

    // console.log(`Found ${itemsWithDropdown.length} menu items with direct submenus.`); // Debug log

    itemsWithDropdown.forEach(itemLi => {
        const link = itemLi.querySelector(":scope > a");
        const dropdown = itemLi.querySelector(":scope > ul"); // UL con trực tiếp

        if (link && dropdown) {
            // --- Bước 1: Tạo và chèn nút Toggle (+/-) ---
            // Kiểm tra xem nút đã tồn tại chưa để tránh tạo nhiều lần nếu hàm chạy lại
            let toggleButton = itemLi.querySelector(':scope > .submenu-toggle');
            if (!toggleButton) {
                toggleButton = document.createElement('span');
                toggleButton.classList.add('submenu-toggle');
                toggleButton.setAttribute('aria-hidden', 'true'); // Không cần thiết cho screen reader đọc vì link đã có
                toggleButton.textContent = '+'; // Mặc định là dấu cộng
                // Chèn nút toggle vào SAU thẻ link <a>
                link.parentNode.insertBefore(toggleButton, link.nextSibling);
            }

            // Đặt trạng thái ban đầu của nút +/- dựa trên class 'active' của dropdown (nếu có)
            const initiallyOpen = dropdown.classList.contains('active');
            toggleButton.textContent = initiallyOpen ? '−' : '+'; // Dùng dấu trừ dài '−' (U+2212)
            toggleButton.classList.toggle('open', initiallyOpen);

            // --- Bước 2: Gán sự kiện cho nút Toggle (+/-) ---
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault(); // Ngăn hành vi mặc định
                e.stopPropagation(); // Ngăn sự kiện nổi bọt lên link hoặc li

                // Toggle class 'active' trên UL dropdown
                const isOpen = dropdown.classList.toggle('active');

                // Cập nhật text và class của nút toggle
                toggleButton.textContent = isOpen ? '−' : '+';
                toggleButton.classList.toggle('open', isOpen);

                // **Tùy chọn:** Đóng các submenu cùng cấp khác khi mở submenu này
                // if (isOpen) {
                //     const parentUl = itemLi.parentNode; // UL chứa LI này
                //     if (parentUl && parentUl !== header.querySelector('.menu')) { // Chỉ đóng siblings, không đóng cấp cao hơn
                //         const siblingLis = parentUl.querySelectorAll(':scope > li');
                //         siblingLis.forEach(siblingLi => {
                //             if (siblingLi !== itemLi) {
                //                 const siblingDropdown = siblingLi.querySelector(':scope > ul');
                //                 if (siblingDropdown && siblingDropdown.classList.contains('active')) {
                //                     siblingDropdown.classList.remove('active');
                //                     const siblingToggle = siblingLi.querySelector(':scope > .submenu-toggle');
                //                     if (siblingToggle) {
                //                         siblingToggle.textContent = '+';
                //                         siblingToggle.classList.remove('open');
                //                     }
                //                 }
                //             }
                //         });
                //     }
                // }
            });

            // --- Bước 3: Gán sự kiện cho Link (<a>) ---
            link.addEventListener('click', (e) => {
                const isMobile = header.classList.contains('menu-open');
                const isDropdownClosed = !dropdown.classList.contains('active');

                // Chỉ can thiệp khi: ở màn hình mobile VÀ dropdown đang đóng
                if (isMobile && isDropdownClosed) {
                    e.preventDefault(); // Ngăn chặn việc điều hướng của link

                    // Mở dropdown này
                    dropdown.classList.add('active');
                    toggleButton.textContent = '−';
                    toggleButton.classList.add('open');

                    // **Tùy chọn:** Đóng các submenu cùng cấp khác (logic tương tự như trên)
                    // ... (thêm code đóng siblings nếu muốn) ...
                }
                // Trong các trường hợp khác (không phải mobile HOẶC dropdown đã mở):
                // => KHÔNG preventDefault(), cho phép link điều hướng bình thường.
            });

            // Thêm class để tiện styling nếu cần
            itemLi.classList.add('has-submenu');

        } else {
             // Ghi log nếu cấu trúc HTML không đúng (LI có UL nhưng thiếu A, hoặc ngược lại)
             console.warn("Skipping LI setup: Missing direct child <a> or <ul>.", itemLi);
        }
    });
}

/**
 * Hàm khởi tạo chính cho hệ thống menu.
 * Được gọi bởi footer.js sau khi header.html đã được tải vào DOM.
 */
window.initializeMenuSystem = function() {
    console.log("Initializing menu system (main toggle + nested submenus)..."); // Log bắt đầu
    const headerPlaceholder = document.getElementById("header-placeholder");

    if (!headerPlaceholder) {
        console.error("Menu initialization failed: #header-placeholder not found.");
        return; // Thoát nếu không tìm thấy placeholder
    }

    // Đảm bảo header đã thực sự được load vào placeholder
    // Đôi khi cần chờ một chút xíu, nhưng thường DOMContentLoaded trong footer.js là đủ
    const header = headerPlaceholder.querySelector(".header");
    if (!header) {
         // Có thể header chưa kịp render, thử lại sau một khoảng ngắn
         console.warn("#header-placeholder found, but .header content not yet available. Retrying setup shortly...");
         // Sử dụng setTimeout để trì hoãn và thử lại. Quan trọng: không gọi lại initializeMenuSystem trực tiếp gây vòng lặp vô hạn nếu lỗi.
         // Thay vào đó, gọi lại các hàm setup cụ thể.
         setTimeout(() => {
            console.log("Retrying menu setup...");
            const currentHeader = headerPlaceholder.querySelector(".header");
            if (currentHeader) {
                 setupMainMenuToggle(headerPlaceholder);
                 setupNestedSubmenuToggles(headerPlaceholder);
                 console.log("Menu system setup successful on retry.");
            } else {
                console.error("Menu system setup failed on retry: .header still not found.");
            }
         }, 100); // Chờ 100ms
         return; // Thoát khỏi lần chạy hiện tại
    }

    // Nếu header có sẵn ngay lập tức
    setupMainMenuToggle(headerPlaceholder);
    setupNestedSubmenuToggles(headerPlaceholder);
    console.log("Menu system initialization finished."); // Log kết thúc
};

// Không cần DOMContentLoaded listener ở đây vì footer.js sẽ gọi initializeMenuSystem