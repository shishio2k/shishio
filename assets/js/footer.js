// File: assets/js/footer.js
// Chứa logic để include HTML (header, footer, sidebar), khởi tạo các slider (Blog, Video).

// ============================================
// HÀM TÍNH TOÁN ĐƯỜNG DẪN GỐC TƯƠNG ĐỐI
// ============================================
/**
 * Tính toán đường dẫn tương đối từ thư mục chứa file HTML hiện tại
 * đến thư mục gốc của cấu trúc dự án (nơi chứa header.html, footer.html, sidebar.html, assets/).
 * @returns {string} Đường dẫn tương đối (ví dụ: './' hoặc '../').
 */
function getBasePath() {
    const currentPath = window.location.pathname;
    const currentDir = currentPath.substring(0, currentPath.lastIndexOf("/"));
    const dirSegments = currentDir.split("/").filter(Boolean);
    let relativeDepth = 0;
    const isGitHubPages = window.location.hostname.includes("github.io");

    if (isGitHubPages) {
        if (dirSegments.length > 1) {
            relativeDepth = dirSegments.length - 1;
        } else {
            relativeDepth = 0;
        }
    } else {
        relativeDepth = dirSegments.length;
    }
    relativeDepth = Math.max(0, relativeDepth);
    const prefix = relativeDepth === 0 ? "./" : "../".repeat(relativeDepth);
    // console.log(`Path: ${currentPath}, Depth: ${relativeDepth}, BasePath: ${prefix}`); // Bỏ comment để debug đường dẫn
    return prefix;
}

// ============================================
// HÀM KHỞI TẠO SLIDER BLOG (Trong Footer)
// ============================================
/**
 * Khởi tạo slider cho các bài viết blog, thường nằm trong footer.
 */
function initializeBlogSlider() {
    // console.log("Attempting to initialize blog slider (usually in footer)...");
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) {
        console.error(
            "Footer placeholder (#footer-placeholder) not found for blog slider!"
        );
        return;
    }
    const sliderContainer = footerPlaceholder.querySelector(
        ".blog-slider-container"
    );
    const slidesWrapper = footerPlaceholder.querySelector(".slides-wrapper");
    const slides = footerPlaceholder.querySelectorAll(".slide-item");
    const prevBtn = footerPlaceholder.querySelector("#prevBtn");
    const nextBtn = footerPlaceholder.querySelector("#nextBtn");

    if (
        !sliderContainer ||
        !slidesWrapper ||
        !prevBtn ||
        !nextBtn ||
        slides.length === 0
    ) {
        console.warn(
            "Blog Slider elements not found within the loaded footer. Skipping initialization."
        );
        return;
    }
    // console.log(`Blog Slider elements found (${slides.length} slides). Initializing...`);

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
            /* console.warn("Blog Slider container has zero width."); */
        }
        const containerWidth = sliderContainer.offsetWidth;
        const slideWidth =
            containerWidth > 0
                ? containerWidth / slidesToShow
                : slides[0]
                ? slides[0].offsetWidth
                : 0;
        const offset = -currentIndex * slideWidth;
        if (slidesWrapper)
            slidesWrapper.style.transform = `translateX(${offset}px)`;
    }

    function updateButtonStates() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn)
            nextBtn.disabled = currentIndex >= totalSlides - slidesToShow;
    }

    if (nextBtn)
        nextBtn.addEventListener("click", () => {
            if (currentIndex < totalSlides - slidesToShow) {
                currentIndex++;
                updateSliderPosition();
                updateButtonStates();
            }
        });
    if (prevBtn)
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
        resizeTimerBlog = setTimeout(updateSlidesToShow, 150);
    });
    updateSlidesToShow(); // Init
    // console.log("Blog slider initialization complete.");
}

// ============================================
// HÀM KHỞI TẠO SLIDER VIDEO (Trong Sidebar)
// ============================================
/**
 * Khởi tạo slider cho các video, bây giờ nằm trong sidebar.
 * Hàm này sẽ được gọi như một callback sau khi sidebar.html được tải xong.
 */
function initializeVideoSlider() {
    // console.log("Attempting to initialize video slider (usually in sidebar)...");
    // Tìm container slider video BÊN TRONG sidebar placeholder
    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (!sidebarPlaceholder) {
        console.error(
            "Sidebar placeholder (#sidebar-placeholder) not found for video slider!"
        );
        return;
    }
    const sliderContainer = sidebarPlaceholder.querySelector(".slide-video"); // Tìm trong sidebar
    if (!sliderContainer) {
        console.log(
            "Video slider container (.slide-video) not found within sidebar. Skipping initialization."
        );
        return;
    }
    const slidesWrapperVideo = sliderContainer.querySelector(
        ".slides-wrapper-video"
    );
    const slidesVideo = sliderContainer.querySelectorAll(".slide-item-video");
    const prevBtnVideo = sliderContainer.querySelector("#prevBtnVideo");
    const nextBtnVideo = sliderContainer.querySelector("#nextBtnVideo");

    if (
        !slidesWrapperVideo ||
        !prevBtnVideo ||
        !nextBtnVideo ||
        slidesVideo.length === 0
    ) {
        console.error(
            "Video Slider elements not found within .slide-video in sidebar!"
        );
        return;
    }
    // console.log(`Video Slider elements found (${slidesVideo.length} slides). Initializing...`);

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
            /* console.warn("Video Slider container has zero width."); */
        }
        const containerWidth = sliderContainer.offsetWidth;
        const slideWidth =
            containerWidth > 0
                ? containerWidth / slidesToShowVideo
                : slidesVideo[0]
                ? slidesVideo[0].offsetWidth
                : 0;
        const offset = -currentIndexVideo * slideWidth;
        if (slidesWrapperVideo)
            slidesWrapperVideo.style.transform = `translateX(${offset}px)`;
    }

    function updateVideoButtonStates() {
        if (prevBtnVideo) prevBtnVideo.disabled = currentIndexVideo === 0;
        if (nextBtnVideo)
            nextBtnVideo.disabled =
                currentIndexVideo >= totalSlidesVideo - slidesToShowVideo;
    }

    if (nextBtnVideo)
        nextBtnVideo.addEventListener("click", () => {
            if (currentIndexVideo < totalSlidesVideo - slidesToShowVideo) {
                currentIndexVideo++;
                updateVideoSliderPosition();
                updateVideoButtonStates();
            }
        });
    if (prevBtnVideo)
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
        resizeTimerVideo = setTimeout(updateVideoSliderPosition, 150);
    });
    updateVideoSliderPosition(); // Init position
    updateVideoButtonStates(); // Init button states
    // console.log("Video slider initialization complete.");
}

// ============================================
// HÀM INCLUDE HTML (Chèn Header, Footer, Sidebar)
// ============================================
/**
 * Tải nội dung từ một file HTML và chèn vào một element trên trang.
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
                throw new Error(
                    `HTTP error ${response.status} fetching ${fetchPath}`
                );
            }
            return response.text();
        })
        .then((data) => {
            const target = document.getElementById(targetElementId);
            if (target) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data;
                // Sửa đường dẫn tương đối trong nội dung được tải
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
                target.innerHTML = tempDiv.innerHTML; // Chèn nội dung
                // console.log(`Loaded ${fetchPath} into #${targetElementId}`);
                if (typeof callback === "function") {
                    // console.log(`Executing callback for ${fileName}`);
                    try {
                        callback();
                    } catch (e) {
                        console.error(`Callback error for ${fileName}:`, e);
                    }
                }
            } else {
                console.error(
                    `Target element #${targetElementId} not found for ${fileName}.`
                );
            }
        })
        .catch((error) => {
            console.error(`Error including HTML (${fetchPath}):`, error);
            const target = document.getElementById(targetElementId);
            if (target) {
                // Hiển thị lỗi trên trang
                target.innerHTML = `<div style="color:#D8000C;background-color:#FFBABA;border:1px solid;margin:10px 0;padding:15px;border-radius:5px;"><strong>Error:</strong> Could not load <code>${fileName}</code>. Check path/filename.<br><small>${error.message}</small></div>`;
            }
        });
}

// ============================================
// THỰC THI KHI DOM SẴN SÀNG
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // console.log("DOM fully loaded. Starting includes...");

    // 1. Chèn Header và khởi tạo Menu System trong callback
    includeHTML("header.html", "header-placeholder", () => {
        if (typeof window.initializeMenuSystem === "function") {
            window.initializeMenuSystem();
        } else {
            console.error(
                "window.initializeMenuSystem not defined! Load menu-toggle.js first."
            );
        }
    });

    // 2. Chèn Sidebar và khởi tạo Video Slider trong callback (QUAN TRỌNG)
    includeHTML("sidebar.html", "sidebar-placeholder", initializeVideoSlider);

    // 3. Chèn Footer và khởi tạo Blog Slider trong callback
    includeHTML("footer.html", "footer-placeholder", initializeBlogSlider);

    // console.log("Include calls initiated.");
});
