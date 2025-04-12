// File: assets/js/footer.js

// ============================================
// HÀM TÍNH TOÁN ĐƯỜNG DẪN GỐC TƯƠNG ĐỐI (Giữ nguyên)
// ============================================
function getBasePath() {
    const pathname = window.location.pathname;
    const pathSegments = pathname
        .split("/")
        .filter((segment) => segment.length > 0);
    const depth = Math.max(0, pathSegments.length - 1);
    const prefix = depth === 0 ? "./" : "../".repeat(depth);
    // console.log(`Pathname: ${pathname}, Depth: ${depth}, BasePath: ${prefix}`);
    return prefix;
}

// ============================================
// HÀM KHỞI TẠO SLIDER (Giữ nguyên)
// ============================================
// ... (code hàm initializeBlogSlider không đổi) ...

// ============================================
// HÀM includeHTML (SỬA ĐỔI ĐỂ CHỈNH SỬA PATH BÊN TRONG HTML)
// ============================================
function includeHTML(fileName, targetElementId, callback) {
    const basePath = getBasePath(); // Ví dụ: './' hoặc '../'
    const fetchPath = basePath + fileName; // Đường dẫn để fetch file HTML

    console.log(`Fetching: ${fetchPath}`);

    fetch(fetchPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status} for ${fetchPath}`
                );
            }
            return response.text();
        })
        .then((data) => {
            const target = document.getElementById(targetElementId);
            if (target) {
                // --- BẮT ĐẦU PHẦN SỬA ĐỔI ĐƯỜNG DẪN ---
                // Tạo một element tạm thời để chứa HTML được fetch
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data;

                // Tìm tất cả các thẻ img có src bắt đầu bằng "assets/"
                const images = tempDiv.querySelectorAll('img[src^="assets/"]');
                images.forEach((img) => {
                    const originalSrc = img.getAttribute("src");
                    // Chỉ thêm basePath nếu nó chưa được thêm (phòng trường hợp chạy lại)
                    if (
                        !originalSrc.startsWith(basePath) &&
                        basePath !== "./"
                    ) {
                        img.src = basePath + originalSrc; // Ví dụ: ../assets/img/img-1.jpg
                        console.log(`Updated img src: ${img.src}`);
                    } else if (
                        basePath === "./" &&
                        originalSrc.startsWith("../")
                    ) {
                        // Trường hợp đặc biệt: Nếu đang ở gốc mà src lại là ../assets thì sửa lại
                        img.src = originalSrc.substring(3); // Bỏ '../'
                        console.log(`Corrected img src at root: ${img.src}`);
                    }
                });

                // Tìm tất cả các thẻ link CSS có href bắt đầu bằng "assets/" (nếu có)
                const links = tempDiv.querySelectorAll('link[href^="assets/"]');
                links.forEach((link) => {
                    const originalHref = link.getAttribute("href");
                    if (
                        !originalHref.startsWith(basePath) &&
                        basePath !== "./"
                    ) {
                        link.href = basePath + originalHref;
                        console.log(`Updated link href: ${link.href}`);
                    } else if (
                        basePath === "./" &&
                        originalHref.startsWith("../")
                    ) {
                        link.href = originalHref.substring(3);
                        console.log(
                            `Corrected link href at root: ${link.href}`
                        );
                    }
                });

                // Tìm tất cả các thẻ a có href bắt đầu bằng "assets/" (nếu có)
                const anchors = tempDiv.querySelectorAll('a[href^="assets/"]');
                anchors.forEach((a) => {
                    const originalHref = a.getAttribute("href");
                    if (
                        !originalHref.startsWith(basePath) &&
                        basePath !== "./"
                    ) {
                        a.href = basePath + originalHref;
                        console.log(`Updated a href: ${a.href}`);
                    } else if (
                        basePath === "./" &&
                        originalHref.startsWith("../")
                    ) {
                        a.href = originalHref.substring(3);
                        console.log(`Corrected a href at root: ${a.href}`);
                    }
                });
                // Bạn có thể thêm các selector khác nếu cần (ví dụ: script[src])

                // --- KẾT THÚC PHẦN SỬA ĐỔI ĐƯỜNG DẪN ---

                // Chèn nội dung đã được chỉnh sửa vào trang
                target.innerHTML = tempDiv.innerHTML;
                //-----------------------------------------

                console.log(
                    `Successfully loaded and processed ${fetchPath} into #${targetElementId}`
                );

                if (typeof callback === "function") {
                    console.log(`Executing callback for ${fileName}`);
                    try {
                        callback();
                    } catch (e) {
                        console.error(
                            `Error executing callback for ${fileName}:`,
                            e
                        );
                    }
                }
            } else {
                console.error(
                    `Target element with ID "${targetElementId}" not found.`
                );
            }
        })
        .catch((error) => {
            console.error(`Error fetching or processing ${fetchPath}:`, error);
            const target = document.getElementById(targetElementId);
            if (target) {
                target.innerHTML = `<p style="color: red;">Lỗi khi tải ${fileName}. Chi tiết lỗi xem ở Console (F12).</p>`;
            }
        });
}

// ============================================
// GỌI HÀM ĐỂ CHÈN HTML (Giữ nguyên)
// ============================================
includeHTML("header.html", "header-placeholder");
includeHTML("footer.html", "footer-placeholder", initializeBlogSlider);
