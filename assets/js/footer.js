// ============================================
// HÀM KHỞI TẠO SLIDER (Đặt hàm này LÊN TRÊN)
// ============================================
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
// HÀM includeHTML (Đã sửa đổi để có callback)
// ============================================
function includeHTML(filePath, targetElementId, callback) {
    // Thêm tham số callback
    fetch(filePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status} for ${filePath}`
                );
            }
            return response.text();
        })
        .then((data) => {
            const target = document.getElementById(targetElementId);
            if (target) {
                target.innerHTML = data;
                console.log(
                    `Successfully loaded ${filePath} into #${targetElementId}`
                );
                // Gọi callback SAU KHI chèn HTML thành công
                if (typeof callback === "function") {
                    console.log(`Executing callback for ${filePath}`);
                    try {
                        callback(); // Gọi hàm callback (ví dụ: initializeBlogSlider)
                    } catch (e) {
                        console.error(
                            `Error executing callback for ${filePath}:`,
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
            console.error(`Error fetching or processing ${filePath}:`, error);
            const target = document.getElementById(targetElementId);
            if (target) {
                target.innerHTML = `<p style="color: red;">Lỗi khi tải ${filePath}. Chi tiết lỗi xem ở Console (F12).</p>`;
            }
        });
}

// ============================================
// GỌI HÀM ĐỂ CHÈN HTML (Đặt phần này CUỐI CÙNG)
// ============================================

// Chèn header (không cần callback phức tạp nếu header không có slider)
includeHTML("../header.html", "header-placeholder");

// Chèn footer VÀ chỉ định hàm initializeBlogSlider làm callback
includeHTML("../footer.html", "footer-placeholder", initializeBlogSlider);
