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
function initializeBlogSlider() {
    console.log("Attempting to initialize blog slider inside footer..."); // Log để kiểm tra

    // Tìm các element BÊN TRONG #footer-placeholder sau khi nó được load
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) {
        console.error("Footer placeholder element not found!");
        return;
    }

    // QuerySelector từ bên trong footerPlaceholder để đảm bảo phạm vi đúng
    const slidesWrapper = footerPlaceholder.querySelector(".slides-wrapper");
    const slides = footerPlaceholder.querySelectorAll(".slide-item");
    const prevBtn = footerPlaceholder.querySelector("#prevBtn"); // Sử dụng querySelector cho ID cũng được
    const nextBtn = footerPlaceholder.querySelector("#nextBtn");
    const container = footerPlaceholder.querySelector(".blog-slider-container");

    // --- Kiểm tra quan trọng ---
    if (
        !slidesWrapper ||
        !prevBtn ||
        !nextBtn ||
        !container ||
        slides.length === 0
    ) {
        console.error(
            "Slider elements (wrapper, buttons, container, or items) not found within the loaded footer content!"
        );
        // In ra các element tìm được để debug:
        console.log("slidesWrapper:", slidesWrapper);
        console.log("prevBtn:", prevBtn);
        console.log("nextBtn:", nextBtn);
        console.log("container:", container);
        console.log("slides count:", slides.length);
        return; // Dừng nếu thiếu element
    }
    console.log("Slider elements found. Initializing...");

    // --- Code Lõi Của Slider (Giữ nguyên từ các ví dụ trước) ---
    let currentIndex = 0;
    let totalSlides = slides.length;
    let slidesToShow = 2; // Mặc định

    function updateSlidesToShow() {
        const oldSlidesToShow = slidesToShow;
        if (window.innerWidth <= 600) {
            slidesToShow = 1;
        } else {
            slidesToShow = 2;
        }

        if (oldSlidesToShow !== slidesToShow) {
            const itemWidthPercentage = 100 / slidesToShow;
            slides.forEach((slide) => {
                // Quan trọng: đảm bảo áp dụng style đúng
                slide.style.flex = `0 0 ${itemWidthPercentage}%`;
                slide.style.maxWidth = `${itemWidthPercentage}%`;
            });
        }
        // Điều chỉnh index nếu cần sau khi thay đổi slidesToShow
        if (currentIndex > totalSlides - slidesToShow) {
            currentIndex = Math.max(0, totalSlides - slidesToShow);
        }
        updateSliderPosition();
        updateButtonStates();
    }

    function updateSliderPosition() {
        // Phải chắc chắn container có width > 0 khi hàm này chạy
        if (container.offsetWidth === 0) {
            console.warn("Slider container has zero width. Check CSS.");
            // Có thể thử gọi lại sau một khoảng trễ nhỏ nếu CSS chưa kịp áp dụng
            // setTimeout(updateSliderPosition, 100);
            // return;
        }
        const containerWidth = container.offsetWidth;
        const slideWidth = containerWidth / slidesToShow;
        const offset = -currentIndex * slideWidth;
        // Debug: console.log(`Index: ${currentIndex}, SlideWidth: ${slideWidth.toFixed(2)}, Offset: ${offset.toFixed(2)}`);
        slidesWrapper.style.transform = `translateX(${offset}px)`;
    }

    function updateButtonStates() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - slidesToShow;
        // Debug: console.log(`Buttons Updated - Prev: ${prevBtn.disabled}, Next: ${nextBtn.disabled}`);
    }

    // --- Event Listeners ---
    nextBtn.addEventListener("click", () => {
        if (currentIndex < totalSlides - slidesToShow) {
            currentIndex++;
            updateSliderPosition();
            updateButtonStates();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
            updateButtonStates();
        }
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Debug: console.log('Window Resized');
            updateSlidesToShow();
        }, 150);
    });

    // --- Khởi tạo Slider ---
    console.log(`Initial Total Slides found: ${totalSlides}`);
    updateSlidesToShow(); // Chạy lần đầu để thiết lập
    console.log("Blog slider initialized successfully inside footer.");
}
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
