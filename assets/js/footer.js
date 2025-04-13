// File: assets/js/footer.js
// Tổng hợp code cho Header/Footer include, Blog Slider và Video Slider

// ============================================
// HÀM TÍNH TOÁN ĐƯỜNG DẪN GỐC TƯƠNG ĐỐI
// ============================================
/**
 * Tính toán đường dẫn tương đối từ trang hiện tại đến thư mục gốc của trang web.
 * Cần thiết để load các file như header.html, footer.html, assets/... từ các trang con.
 * @returns {string} Đường dẫn tương đối (ví dụ: './' hoặc '../' hoặc '../../').
 */
function getBasePath() {
    const pathname = window.location.pathname;
    // Tách đường dẫn thành các đoạn, loại bỏ các đoạn trống (thường do dấu / ở đầu/cuối)
    const pathSegments = pathname
        .split("/")
        .filter((segment) => segment.length > 0);

    // Kiểm tra xem có đang ở trong một thư mục con cụ thể không (ví dụ: 'opfp', 'rdr2')
    // Điều này quan trọng nếu thư mục gốc của bạn không phải là root domain (ví dụ: localhost/myproject/)
    // Nếu tên thư mục gốc của bạn khác, hãy thêm vào đây.
    const knownSubdirectories = ["opfp", "rdr2"]; // Thêm các thư mục con khác nếu cần
    const isSubdirectory = pathSegments.some((segment) =>
        knownSubdirectories.includes(segment)
    );

    // Tính độ sâu:
    // - Nếu ở thư mục gốc (không có segment hoặc không phải subdirectory đã biết), depth = 0
    // - Nếu ở thư mục con, depth = số lượng segment - 1 (ví dụ: /opfp/index.html -> 1 segment 'opfp', depth = 0)
    //   (Lưu ý: logic này giả định index.html nằm trực tiếp trong thư mục con)
    // - Nếu ở sâu hơn (ví dụ: /blog/category/post.html), depth = số segment.
    // Cách tính đơn giản hơn: độ sâu là số lượng thư mục cần đi lên để về gốc.
    let depth = 0;
    if (pathSegments.length > 0) {
        // Nếu segment cuối cùng là tên file (có dấu chấm), giảm depth đi 1
        // Tuy nhiên, để đơn giản, ta có thể giả định cấu trúc URL không quá phức tạp
        // Hoặc dựa vào việc có phải là thư mục con đã biết không
        // Logic được điều chỉnh: Độ sâu là số segment nếu không phải index.html ở root
        // Ví dụ: / -> 0 segments, depth 0
        // Ví dụ: /opfp/ -> 1 segment, depth 1 (cần '../')
        // Ví dụ: /blog/post.html -> 2 segments, depth 2 (cần '../../')
        // Cần kiểm tra lại logic này cho các trường hợp cụ thể
        depth = pathSegments.length;
        // Nếu URL là /opfp/ hoặc /rdr2/ (trang index của thư mục con)
        // và chỉ có 1 segment, depth nên là 1 để dùng '../'
        if (
            pathSegments.length === 1 &&
            knownSubdirectories.includes(pathSegments[0]) &&
            pathname.endsWith("/")
        ) {
            depth = 1;
        } else if (pathSegments.length > 0 && !pathname.endsWith("/")) {
            // Nếu là file cụ thể (vd: /opfp/page.html), depth là số thư mục cha
            depth = pathSegments.length - 1;
        } else {
            depth = pathSegments.length;
        }
    }

    // Đảm bảo depth không âm
    depth = Math.max(0, depth);

    const prefix = depth === 0 ? "./" : "../".repeat(depth);
    // Ghi log để kiểm tra
    // console.log(`Path: ${pathname}, Segments: [${pathSegments.join(', ')}], Depth: ${depth}, BasePath: ${prefix}`);
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

    // Slider này nằm trong footer, nên tìm element trong #footer-placeholder
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) {
        console.error(
            "Footer placeholder element (#footer-placeholder) not found for blog slider!"
        );
        return;
    }

    // Tìm các element cần thiết BÊN TRONG footerPlaceholder
    const sliderContainer = footerPlaceholder.querySelector(
        ".blog-slider-container"
    ); // Container chính để lấy width
    const slidesWrapper = footerPlaceholder.querySelector(".slides-wrapper");
    const slides = footerPlaceholder.querySelectorAll(".slide-item");
    const prevBtn = footerPlaceholder.querySelector("#prevBtn"); // ID nút Previous của Blog Slider
    const nextBtn = footerPlaceholder.querySelector("#nextBtn"); // ID nút Next của Blog Slider

    // --- Kiểm tra các element ---
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
        // In ra để debug
        console.log("sliderContainer:", sliderContainer);
        console.log("slidesWrapper:", slidesWrapper);
        console.log("prevBtn:", prevBtn);
        console.log("nextBtn:", nextBtn);
        console.log("slides count:", slides.length);
        return; // Dừng nếu thiếu element
    }
    console.log("Blog Slider elements found. Initializing...");

    // --- Code Lõi Của Slider Blog ---
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slidesToShow = 2; // Mặc định hiển thị 2 slide

    // Hàm cập nhật số lượng slide hiển thị dựa trên kích thước màn hình
    function updateSlidesToShow() {
        const oldSlidesToShow = slidesToShow;
        // Thay đổi điểm breakpoint nếu cần
        if (window.innerWidth <= 768) {
            // Ví dụ: màn hình nhỏ hơn hoặc bằng 768px
            slidesToShow = 1;
        } else {
            slidesToShow = 2;
        }

        // Chỉ cập nhật lại nếu giá trị thay đổi
        if (oldSlidesToShow !== slidesToShow) {
            console.log(
                `Blog Slider: Window width ${window.innerWidth}px, slidesToShow changed to ${slidesToShow}`
            );
            const itemWidthPercentage = 100 / slidesToShow;
            slides.forEach((slide) => {
                slide.style.flex = `0 0 ${itemWidthPercentage}%`;
                slide.style.maxWidth = `${itemWidthPercentage}%`;
            });
            // Điều chỉnh lại index nếu index hiện tại vượt quá giới hạn mới
            if (currentIndex > totalSlides - slidesToShow) {
                currentIndex = Math.max(0, totalSlides - slidesToShow);
            }
            // Cập nhật lại vị trí và trạng thái nút sau khi thay đổi slidesToShow
            updateSliderPosition();
            updateButtonStates();
        }
    }

    // Hàm cập nhật vị trí của wrapper để hiển thị đúng slide
    function updateSliderPosition() {
        // Lấy chiều rộng của container chứa slider (quan trọng cho tính toán offset)
        if (sliderContainer.offsetWidth === 0 && slides.length > 0) {
            console.warn(
                "Blog Slider container (.blog-slider-container) has zero width. Recalculating may be needed after CSS loads/applies."
            );
            // Có thể không cần return, thử tính toán dựa trên slide đầu tiên nếu có
            // return;
        }
        const containerWidth = sliderContainer.offsetWidth;
        // Tính chiều rộng của một slide (dựa trên container và số slide hiển thị)
        const slideWidth =
            containerWidth > 0
                ? containerWidth / slidesToShow
                : slides[0]
                ? slides[0].offsetWidth
                : 0; // Dự phòng nếu containerWidth = 0
        const offset = -currentIndex * slideWidth;
        // console.log(`Blog Slider - Index: ${currentIndex}, ContainerW: ${containerWidth}, SlidesToShow: ${slidesToShow}, SlideW: ${slideWidth.toFixed(2)}, Offset: ${offset.toFixed(2)}`);
        slidesWrapper.style.transform = `translateX(${offset}px)`;
    }

    // Hàm cập nhật trạng thái (enabled/disabled) của các nút
    function updateButtonStates() {
        prevBtn.disabled = currentIndex === 0;
        // Nút Next bị disable khi không còn đủ slide để kéo sang phải
        nextBtn.disabled = currentIndex >= totalSlides - slidesToShow;
        // console.log(`Blog Buttons Updated - Prev: ${prevBtn.disabled}, Next: ${nextBtn.disabled}`);
    }

    // --- Event Listeners cho Blog Slider ---
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

    // Xử lý khi thay đổi kích thước cửa sổ
    let resizeTimerBlog;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimerBlog);
        resizeTimerBlog = setTimeout(() => {
            console.log("Window Resized - Updating Blog Slider Layout");
            updateSlidesToShow(); // Cập nhật số slide hiển thị trước
            // updateSliderPosition(); // Hàm updateSlidesToShow đã gọi hàm này nếu cần
        }, 150); // Đợi một chút sau khi resize để tránh gọi liên tục
    });

    // --- Khởi tạo Slider Blog ---
    console.log(`Initial Blog Total Slides found: ${totalSlides}`);
    updateSlidesToShow(); // Chạy lần đầu để thiết lập số slide và width
    // updateSliderPosition(); // Đã được gọi trong updateSlidesToShow nếu cần
    // updateButtonStates(); // Đã được gọi trong updateSlidesToShow nếu cần
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

    // Slider video có HTML nằm trực tiếp trong trang, tìm element trực tiếp
    const sliderContainer = document.querySelector(".slide-video"); // Container bao quanh wrapper và nút
    if (!sliderContainer) {
        // Không phải lỗi nếu trang không có video slider này
        console.log(
            "Video slider container (.slide-video) not found on this page. Skipping initialization."
        );
        return;
    }

    // Tìm các thành phần bên trong sliderContainer
    const slidesWrapperVideo = sliderContainer.querySelector(
        ".slides-wrapper-video"
    );
    const slidesVideo = sliderContainer.querySelectorAll(".slide-item-video");
    const prevBtnVideo = sliderContainer.querySelector("#prevBtnVideo"); // ID nút Previous của Video Slider
    const nextBtnVideo = sliderContainer.querySelector("#nextBtnVideo"); // ID nút Next của Video Slider

    // --- Kiểm tra các element ---
    if (
        !slidesWrapperVideo ||
        !prevBtnVideo ||
        !nextBtnVideo ||
        slidesVideo.length === 0
    ) {
        console.error(
            "Video Slider elements (.slides-wrapper-video, #prevBtnVideo, #nextBtnVideo, or .slide-item-video) not found within .slide-video!"
        );
        // In ra để debug
        console.log("slidesWrapperVideo:", slidesWrapperVideo);
        console.log("prevBtnVideo:", prevBtnVideo);
        console.log("nextBtnVideo:", nextBtnVideo);
        console.log("slidesVideo count:", slidesVideo.length);
        return; // Dừng nếu thiếu element
    }
    console.log("Video Slider elements found. Initializing...");

    // --- Code Lõi Của Slider Video ---
    let currentIndexVideo = 0;
    const totalSlidesVideo = slidesVideo.length;
    const slidesToShowVideo = 1; // Luôn hiển thị 1 video một lúc

    // Set style ban đầu cho các slide item (chiếm 100% width)
    const itemWidthPercentageVideo = 100 / slidesToShowVideo;
    slidesVideo.forEach((slide) => {
        slide.style.flex = `0 0 ${itemWidthPercentageVideo}%`;
        slide.style.maxWidth = `${itemWidthPercentageVideo}%`;
    });

    // Hàm cập nhật vị trí của wrapper video
    function updateVideoSliderPosition() {
        if (sliderContainer.offsetWidth === 0 && slidesVideo.length > 0) {
            console.warn(
                "Video Slider container (.slide-video) has zero width. Check CSS (e.g., overflow: hidden?). Recalculating may be needed."
            );
            // return; // Cân nhắc có nên dừng không
        }
        const containerWidth = sliderContainer.offsetWidth;
        // Vì slidesToShowVideo = 1, slideWidth chính là containerWidth
        const slideWidth =
            containerWidth > 0
                ? containerWidth / slidesToShowVideo
                : slidesVideo[0]
                ? slidesVideo[0].offsetWidth
                : 0;
        const offset = -currentIndexVideo * slideWidth;
        // console.log(`Video Slider - Index: ${currentIndexVideo}, ContainerW: ${containerWidth}, SlideW: ${slideWidth.toFixed(2)}, Offset: ${offset.toFixed(2)}`);
        slidesWrapperVideo.style.transform = `translateX(${offset}px)`;
    }

    // Hàm cập nhật trạng thái nút video
    function updateVideoButtonStates() {
        prevBtnVideo.disabled = currentIndexVideo === 0;
        nextBtnVideo.disabled =
            currentIndexVideo >= totalSlidesVideo - slidesToShowVideo;
        // console.log(`Video Buttons Updated - Prev: ${prevBtnVideo.disabled}, Next: ${nextBtnVideo.disabled}`);
    }

    // --- Event Listeners cho Video Slider ---
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

    // Xử lý resize cho video slider
    let resizeTimerVideo;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimerVideo);
        resizeTimerVideo = setTimeout(() => {
            console.log("Window Resized - Updating Video Slider Position");
            updateVideoSliderPosition(); // Chỉ cần cập nhật lại vị trí
        }, 150);
    });

    // --- Khởi tạo Slider Video ---
    console.log(`Initial Video Total Slides found: ${totalSlidesVideo}`);
    updateVideoSliderPosition(); // Cập nhật vị trí ban đầu
    updateVideoButtonStates(); // Cập nhật trạng thái nút ban đầu
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
    const basePath = getBasePath(); // Lấy đường dẫn gốc tương đối
    const fetchPath = basePath + fileName; // Đường dẫn đầy đủ để fetch file

    console.log(`Fetching: ${fetchPath} for target #${targetElementId}`);

    fetch(fetchPath)
        .then((response) => {
            if (!response.ok) {
                // Xử lý lỗi HTTP rõ ràng hơn
                throw new Error(
                    `HTTP error! Status: ${response.status} (${response.statusText}) while fetching ${fetchPath}`
                );
            }
            return response.text(); // Lấy nội dung HTML dưới dạng text
        })
        .then((data) => {
            const target = document.getElementById(targetElementId);
            if (target) {
                // Tạo một element tạm để xử lý nội dung HTML trước khi chèn
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data;

                // --- Sửa đổi đường dẫn tương đối bên trong HTML được tải ---
                // Tìm các thẻ img, link, a, script có src/href bắt đầu bằng "assets/"
                const elementsToUpdate = tempDiv.querySelectorAll(
                    'img[src^="assets/"], link[href^="assets/"], a[href^="assets/"], script[src^="assets/"]'
                );

                elementsToUpdate.forEach((el) => {
                    const attribute = el.hasAttribute("src") ? "src" : "href";
                    const originalPath = el.getAttribute(attribute);

                    // Chỉ thêm basePath nếu đang ở thư mục con (basePath !== './')
                    // và đường dẫn chưa được sửa đổi (không bắt đầu bằng basePath)
                    if (
                        basePath !== "./" &&
                        !originalPath.startsWith(basePath)
                    ) {
                        el.setAttribute(attribute, basePath + originalPath);
                        // console.log(`Updated ${attribute} in ${fileName}: ${el.getAttribute(attribute)}`);
                    }
                    // Trường hợp đặc biệt: Nếu đang ở gốc (basePath === './')
                    // nhưng đường dẫn trong file lại là "../assets/", thì cần loại bỏ "../"
                    else if (
                        basePath === "./" &&
                        originalPath.startsWith("../")
                    ) {
                        el.setAttribute(attribute, originalPath.substring(3)); // Bỏ đi "../"
                        // console.log(`Corrected relative ${attribute} in ${fileName} at root: ${el.getAttribute(attribute)}`);
                    }
                });
                // --- Kết thúc sửa đổi đường dẫn ---

                // Chèn nội dung đã xử lý vào element đích
                target.innerHTML = tempDiv.innerHTML;
                console.log(
                    `Successfully loaded and processed ${fetchPath} into #${targetElementId}`
                );

                // Gọi hàm callback (nếu có) SAU KHI nội dung đã được chèn vào DOM
                if (typeof callback === "function") {
                    console.log(
                        `Executing callback for ${fileName}: ${
                            callback.name || "anonymous"
                        }`
                    );
                    try {
                        // Đảm bảo DOM cập nhật trước khi gọi callback có thể an toàn hơn
                        // Hoặc gọi trực tiếp nếu callback không quá phụ thuộc vào layout render ngay tức thì
                        // requestAnimationFrame(callback);
                        callback();
                    } catch (e) {
                        console.error(
                            `Error executing callback for ${fileName}:`,
                            e
                        );
                    }
                }
            } else {
                // Ghi lỗi nếu không tìm thấy element đích
                console.error(
                    `Target element with ID "${targetElementId}" not found for file ${fileName}.`
                );
            }
        })
        .catch((error) => {
            // Bắt và ghi lỗi trong quá trình fetch hoặc xử lý
            console.error(`Error fetching or processing ${fetchPath}:`, error);
            const target = document.getElementById(targetElementId);
            // Hiển thị thông báo lỗi trên trang nếu có thể
            if (target) {
                target.innerHTML = `<p style="color: red; border: 1px solid red; padding: 10px;">Lỗi khi tải ${fileName}. Chi tiết lỗi xem ở Console (F12).</p>`;
            }
        });
}

// ============================================
// THỰC THI KHI DOM SẴN SÀNG
// ============================================
// Sử dụng 'DOMContentLoaded' để đảm bảo tất cả HTML cơ bản của trang đã được tải
// trước khi thực thi các script tương tác với DOM.
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed.");

    // 1. Chèn Header
    includeHTML("header.html", "header-placeholder");

    // 2. Khởi tạo Video Slider (vì HTML của nó nằm trong trang chính)
    // Hàm này sẽ tự kiểm tra xem slider có tồn tại không
    initializeVideoSlider();

    // 3. Chèn Footer VÀ khởi tạo Blog Slider SAU KHI footer được chèn xong
    // initializeBlogSlider được truyền làm callback cho includeHTML
    includeHTML("footer.html", "footer-placeholder", initializeBlogSlider);

    // Gọi các hàm khởi tạo khác nếu cần (ví dụ: menu toggle, animations, ...)
    // initializeMenuToggle();
});

// ============================================
// CÁC HÀM KHÁC (ví dụ: menu toggle) CÓ THỂ ĐƯỢC ĐỊNH NGHĨA Ở ĐÂY
// VÀ GỌI BÊN TRONG DOMContentLoaded NẾU CẦN
// ============================================

// function initializeMenuToggle() {
//   // Code cho menu toggle
// }
