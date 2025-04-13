// File: assets/js/footer.js
// Chứa logic để include HTML (header, footer), khởi tạo các slider (Blog, Video).

// ============================================
// HÀM TÍNH TOÁN ĐƯỜNG DẪN GỐC TƯƠNG ĐỐI
// ============================================
/**
 * Tính toán đường dẫn tương đối từ thư mục chứa file HTML hiện tại
 * đến thư mục gốc của cấu trúc dự án (nơi chứa header.html, footer.html, assets/).
 * !! Quan trọng: Logic này có thể cần điều chỉnh tùy thuộc vào cấu trúc URL chính xác
 * !! của bạn trên server (đặc biệt là GitHub Pages với tên repository).
 * @returns {string} Đường dẫn tương đối (ví dụ: './' hoặc '../').
 */
function getBasePath() {
    const currentPath = window.location.pathname;
    // Lấy phần thư mục, loại bỏ tên file nếu có
    const currentDir = currentPath.substring(0, currentPath.lastIndexOf("/"));
    // Tách thành các phần (segments), loại bỏ các phần rỗng
    const dirSegments = currentDir.split("/").filter(Boolean);

    // Logic tính toán độ sâu tương đối so với gốc repo (thường là nơi chứa assets/)
    // Giả định: header.html/footer.html nằm ở cùng cấp với thư mục 'assets'
    let relativeDepth = 0;

    // Kiểm tra xem có phải đang chạy trên GitHub Pages không
    const isGitHubPages = window.location.hostname.includes("github.io");

    if (isGitHubPages) {
        // Trên GitHub Pages, URL thường là /repo-name/path/to/page.html
        // Segment đầu tiên là tên repo, không tính vào độ sâu tương đối từ gốc repo
        if (dirSegments.length > 1) {
            relativeDepth = dirSegments.length - 1; // Số cấp cần đi lên từ thư mục con để về gốc repo
        } else {
            relativeDepth = 0; // Đang ở gốc repo (/repo-name/)
        }
    } else {
        // Logic cho môi trường local hoặc server khác
        // Độ sâu là số lượng thư mục
        relativeDepth = dirSegments.length;
    }

    // Đảm bảo độ sâu không âm
    relativeDepth = Math.max(0, relativeDepth);

    // Tạo tiền tố đường dẫn
    const prefix = relativeDepth === 0 ? "./" : "../".repeat(relativeDepth);

    // Log để debug (bạn có thể comment dòng này sau khi đã xác nhận đúng)
    // console.log(`Path: ${currentPath}, Dir: ${currentDir}, Segments: [${dirSegments.join(', ')}], isGH: ${isGitHubPages}, Depth: ${relativeDepth}, BasePath: ${prefix}`);
    return prefix;
}

// ============================================
// HÀM KHỞI TẠO SLIDER BLOG (Trong Footer)
// ============================================
/**
 * Khởi tạo slider cho các bài viết blog, thường nằm trong footer.
 * Hàm này sẽ được gọi như một callback sau khi footer.html được tải xong.
 */
function initializeBlogSlider() {
    console.log("Attempting to initialize blog slider (usually in footer)...");
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) {
        console.error(
            "Footer placeholder element (#footer-placeholder) not found for blog slider!"
        );
        return;
    }
    const sliderContainer = footerPlaceholder.querySelector(
        ".blog-slider-container"
    );
    const slidesWrapper = footerPlaceholder.querySelector(".slides-wrapper");
    const slides = footerPlaceholder.querySelectorAll(".slide-item");
    const prevBtn = footerPlaceholder.querySelector("#prevBtn"); // ID nút Prev của Blog Slider
    const nextBtn = footerPlaceholder.querySelector("#nextBtn"); // ID nút Next của Blog Slider

    if (
        !sliderContainer ||
        !slidesWrapper ||
        !prevBtn ||
        !nextBtn ||
        slides.length === 0
    ) {
        console.error(
            "Blog Slider elements (.blog-slider-container, .slides-wrapper, #prevBtn, #nextBtn, or .slide-item) not found within the loaded footer content!"
        );
        return;
    }
    console.log(
        `Blog Slider elements found (${slides.length} slides). Initializing...`
    );

    let currentIndex = 0;
    const totalSlides = slides.length;
    let slidesToShow = 2;

    function updateSlidesToShow() {
        const oldSlidesToShow = slidesToShow;
        if (window.innerWidth <= 768) {
            slidesToShow = 1;
        } else {
            slidesToShow = 2;
        }

        if (oldSlidesToShow !== slidesToShow) {
            // console.log(`Blog Slider: slidesToShow changed to ${slidesToShow}`);
            const itemWidthPercentage = 100 / slidesToShow;
            slides.forEach((slide) => {
                slide.style.flex = `0 0 ${itemWidthPercentage}%`;
                slide.style.maxWidth = `${itemWidthPercentage}%`;
            });
            if (currentIndex > totalSlides - slidesToShow) {
                currentIndex = Math.max(0, totalSlides - slidesToShow);
            }
            updateSliderPosition();
            updateButtonStates();
        }
    }

    function updateSliderPosition() {
        if (sliderContainer.offsetWidth === 0 && slides.length > 0) {
            console.warn(
                "Blog Slider container (.blog-slider-container) has zero width."
            );
        }
        const containerWidth = sliderContainer.offsetWidth;
        const slideWidth =
            containerWidth > 0
                ? containerWidth / slidesToShow
                : slides[0]
                ? slides[0].offsetWidth
                : 0;
        const offset = -currentIndex * slideWidth;
        slidesWrapper.style.transform = `translateX(${offset}px)`;
    }

    function updateButtonStates() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - slidesToShow;
    }

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

    let resizeTimerBlog;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimerBlog);
        resizeTimerBlog = setTimeout(() => {
            // console.log('Window Resized - Updating Blog Slider Layout');
            updateSlidesToShow();
        }, 150);
    });

    updateSlidesToShow(); // Khởi tạo lần đầu
    console.log("Blog slider initialized successfully.");
}

// ============================================
// HÀM KHỞI TẠO SLIDER VIDEO (Trong trang chính)
// ============================================
/**
 * Khởi tạo slider cho các video, thường nằm trong nội dung chính của trang.
 * Hàm này sẽ được gọi sau khi DOM của trang chính đã sẵn sàng.
 */
function initializeVideoSlider() {
    console.log("Attempting to initialize video slider...");
    const sliderContainer = document.querySelector(".slide-video");
    if (!sliderContainer) {
        console.log(
            "Video slider container (.slide-video) not found on this page. Skipping initialization."
        );
        return; // Không phải lỗi, chỉ là slider này không có trên trang
    }
    const slidesWrapperVideo = sliderContainer.querySelector(
        ".slides-wrapper-video"
    );
    const slidesVideo = sliderContainer.querySelectorAll(".slide-item-video");
    const prevBtnVideo = sliderContainer.querySelector("#prevBtnVideo"); // ID nút Prev video
    const nextBtnVideo = sliderContainer.querySelector("#nextBtnVideo"); // ID nút Next video

    if (
        !slidesWrapperVideo ||
        !prevBtnVideo ||
        !nextBtnVideo ||
        slidesVideo.length === 0
    ) {
        console.error(
            "Video Slider elements (.slides-wrapper-video, #prevBtnVideo, #nextBtnVideo, or .slide-item-video) not found within .slide-video!"
        );
        return;
    }
    console.log(
        `Video Slider elements found (${slidesVideo.length} slides). Initializing...`
    );

    let currentIndexVideo = 0;
    const totalSlidesVideo = slidesVideo.length;
    const slidesToShowVideo = 1;

    const itemWidthPercentageVideo = 100 / slidesToShowVideo;
    slidesVideo.forEach((slide) => {
        slide.style.flex = `0 0 ${itemWidthPercentageVideo}%`;
        slide.style.maxWidth = `${itemWidthPercentageVideo}%`;
    });

    function updateVideoSliderPosition() {
        if (sliderContainer.offsetWidth === 0 && slidesVideo.length > 0) {
            console.warn(
                "Video Slider container (.slide-video) has zero width."
            );
        }
        const containerWidth = sliderContainer.offsetWidth;
        const slideWidth =
            containerWidth > 0
                ? containerWidth / slidesToShowVideo
                : slidesVideo[0]
                ? slidesVideo[0].offsetWidth
                : 0;
        const offset = -currentIndexVideo * slideWidth;
        slidesWrapperVideo.style.transform = `translateX(${offset}px)`;
    }

    function updateVideoButtonStates() {
        prevBtnVideo.disabled = currentIndexVideo === 0;
        nextBtnVideo.disabled =
            currentIndexVideo >= totalSlidesVideo - slidesToShowVideo;
    }

    nextBtnVideo.addEventListener("click", () => {
        if (currentIndexVideo < totalSlidesVideo - slidesToShowVideo) {
            currentIndexVideo++;
            updateVideoSliderPosition();
            updateVideoButtonStates();
        }
    });
    prevBtnVideo.addEventListener("click", () => {
        if (currentIndexVideo > 0) {
            currentIndexVideo--;
            updateVideoSliderPosition();
            updateVideoButtonStates();
        }
    });

    let resizeTimerVideo;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimerVideo);
        resizeTimerVideo = setTimeout(() => {
            // console.log('Window Resized - Updating Video Slider Position');
            updateVideoSliderPosition();
        }, 150);
    });

    updateVideoSliderPosition(); // Khởi tạo vị trí
    updateVideoButtonStates(); // Khởi tạo trạng thái nút
    console.log("Video slider initialized successfully.");
}

// ============================================
// HÀM INCLUDE HTML (Chèn Header, Footer, etc.)
// ============================================
/**
 * Tải nội dung từ một file HTML và chèn vào một element trên trang.
 * Đồng thời sửa các đường dẫn tương đối (assets/, ...) bên trong HTML được tải.
 * @param {string} fileName Tên file HTML cần tải (ví dụ: 'header.html').
 * @param {string} targetElementId ID của element đích để chèn HTML vào.
 * @param {function} [callback] Hàm tùy chọn sẽ được gọi sau khi HTML được chèn thành công.
 */
function includeHTML(fileName, targetElementId, callback) {
    const basePath = getBasePath();
    const fetchPath = basePath + fileName;

    // console.log(`Fetching: ${fetchPath} for target #${targetElementId}`);

    fetch(fetchPath)
        .then((response) => {
            if (!response.ok) {
                // Xử lý lỗi HTTP, cố gắng đọc nội dung lỗi từ server
                return response
                    .text()
                    .then((text) => {
                        throw new Error(
                            `HTTP error! Status: ${response.status} (${
                                response.statusText
                            }) fetching ${fetchPath}. Server response: ${text.substring(
                                0,
                                200
                            )}...`
                        );
                    })
                    .catch(() => {
                        throw new Error(
                            `HTTP error! Status: ${response.status} (${response.statusText}) fetching ${fetchPath}. Could not read error body.`
                        );
                    });
            }
            return response.text();
        })
        .then((data) => {
            const target = document.getElementById(targetElementId);
            if (target) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data;

                // --- Sửa đổi đường dẫn tương đối ---
                const elementsToUpdate = tempDiv.querySelectorAll(
                    'img[src^="assets/"], link[href^="assets/"], a[href^="assets/"], script[src^="assets/"]'
                );
                elementsToUpdate.forEach((el) => {
                    const attribute = el.hasAttribute("src") ? "src" : "href";
                    const originalPath = el.getAttribute(attribute);
                    if (
                        basePath !== "./" &&
                        !originalPath.startsWith(basePath)
                    ) {
                        el.setAttribute(attribute, basePath + originalPath);
                    } else if (
                        basePath === "./" &&
                        originalPath.startsWith("../")
                    ) {
                        el.setAttribute(attribute, originalPath.substring(3));
                    }
                });
                // --- Kết thúc sửa đổi ---

                target.innerHTML = tempDiv.innerHTML; // Chèn nội dung đã xử lý
                // console.log(`Successfully loaded and processed ${fetchPath} into #${targetElementId}`);

                // Gọi callback (nếu có) SAU KHI chèn HTML
                if (typeof callback === "function") {
                    // console.log(`Executing callback for ${fileName}: ${callback.name || 'anonymous'}`);
                    try {
                        // requestAnimationFrame(callback); // Cân nhắc nếu callback cần layout chính xác
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
                    `Target element with ID "${targetElementId}" not found for file ${fileName}.`
                );
            }
        })
        .catch((error) => {
            // Ghi lỗi fetch hoặc xử lý data ra console
            console.error(`Error in includeHTML for ${fetchPath}:`, error);
            const target = document.getElementById(targetElementId);
            // Hiển thị lỗi trên trang
            if (target) {
                target.innerHTML = `<div style="color: #D8000C; background-color: #FFBABA; border: 1px solid; margin: 10px 0px; padding:15px; border-radius: 5px;"><strong>Lỗi:</strong> Không thể tải file <code>${fileName}</code>. Kiểm tra đường dẫn và tên file.<br><small>Chi tiết: ${error.message}</small></div>`;
            }
        });
}

// ============================================
// THỰC THI KHI DOM SẴN SÀNG
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed. Starting initial setup.");

    // 1. Chèn Header và khởi tạo Menu System trong callback
    includeHTML("header.html", "header-placeholder", () => {
        // Callback này chạy sau khi header.html được chèn thành công
        if (typeof window.initializeMenuSystem === "function") {
            window.initializeMenuSystem(); // Gọi hàm từ menu-toggle.js
        } else {
            console.error(
                "window.initializeMenuSystem is not defined! Ensure menu-toggle.js is loaded BEFORE footer.js."
            );
        }
    });

    // 2. Khởi tạo Video Slider (nếu có trên trang)
    initializeVideoSlider();

    // 3. Chèn Footer và khởi tạo Blog Slider trong callback
    includeHTML("footer.html", "footer-placeholder", initializeBlogSlider);

    console.log("Initial setup calls have been made.");
});
