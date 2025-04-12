// ============================================
// HÀM TÍNH TOÁN ĐƯỜNG DẪN GỐC TƯƠNG ĐỐI
// ============================================
function getBasePath() {
    // Lấy đường dẫn của trang hiện tại, ví dụ: "/shishio/" hoặc "/shishio/rdr2/"
    const pathname = window.location.pathname;

    // Tách đường dẫn thành các phần, loại bỏ các phần tử rỗng (do dấu / ở đầu/cuối)
    // Ví dụ: "/shishio/" -> ["shishio"]
    // Ví dụ: "/shishio/rdr2/" -> ["shishio", "rdr2"]
    // Ví dụ: "/shishio/opfp/somepage.html" -> ["shishio", "opfp", "somepage.html"]
    const pathSegments = pathname.split('/').filter(segment => segment.length > 0);

    // Giả định rằng segment đầu tiên luôn là tên repo trên GitHub Pages project site
    // Số lượng segment *sau* tên repo cho biết độ sâu thư mục so với gốc repo
    const depth = Math.max(0, pathSegments.length - 1); // Độ sâu là số segment trừ đi 1 (tên repo)

    // Tạo tiền tố đường dẫn: lặp lại '../' cho mỗi cấp độ sâu
    // Nếu depth = 0 (ở gốc repo), tiền tố là './'
    // Nếu depth = 1 (như rdr2/), tiền tố là '../'
    // Nếu depth = 2 (như abc/xyz/), tiền tố là '../../'
    const prefix = depth === 0 ? './' : '../'.repeat(depth);

    // console.log(`Pathname: ${pathname}, Depth: ${depth}, BasePath: ${prefix}`); // Dùng để debug nếu cần
    return prefix;
}


// ============================================
// HÀM KHỞI TẠO SLIDER (Giữ nguyên không đổi)
// ============================================
function initializeBlogSlider() {
    console.log("Attempting to initialize blog slider inside footer...");
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (!footerPlaceholder) {
        console.error("Footer placeholder element not found!");
        return;
    }
    const slidesWrapper = footerPlaceholder.querySelector(".slides-wrapper");
    const slides = footerPlaceholder.querySelectorAll(".slide-item");
    const prevBtn = footerPlaceholder.querySelector("#prevBtn");
    const nextBtn = footerPlaceholder.querySelector("#nextBtn");
    const container = footerPlaceholder.querySelector(".blog-slider-container");

    if (!slidesWrapper || !prevBtn || !nextBtn || !container || slides.length === 0) {
        console.error("Slider elements not found within the loaded footer content!");
        console.log("slidesWrapper:", slidesWrapper);
        console.log("prevBtn:", prevBtn);
        console.log("nextBtn:", nextBtn);
        console.log("container:", container);
        console.log("slides count:", slides.length);
        return;
    }
    console.log("Slider elements found. Initializing...");

    let currentIndex = 0;
    let totalSlides = slides.length;
    let slidesToShow = 2;

    function updateSlidesToShow() {
        const oldSlidesToShow = slidesToShow;
        if (window.innerWidth <= 600) slidesToShow = 1; else slidesToShow = 2;
        if (oldSlidesToShow !== slidesToShow) {
            const itemWidthPercentage = 100 / slidesToShow;
            slides.forEach(slide => {
                slide.style.flex = `0 0 ${itemWidthPercentage}%`;
                slide.style.maxWidth = `${itemWidthPercentage}%`;
            });
        }
        if (currentIndex > totalSlides - slidesToShow) currentIndex = Math.max(0, totalSlides - slidesToShow);
        updateSliderPosition(); updateButtonStates();
    }
    function updateSliderPosition() {
        if (container.offsetWidth === 0) { console.warn("Slider container has zero width."); }
        const containerWidth = container.offsetWidth;
        const slideWidth = containerWidth / slidesToShow;
        const offset = -currentIndex * slideWidth;
        slidesWrapper.style.transform = `translateX(${offset}px)`;
    }
    function updateButtonStates() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - slidesToShow;
    }
    nextBtn.addEventListener("click", () => {
        if (currentIndex < totalSlides - slidesToShow) { currentIndex++; updateSliderPosition(); updateButtonStates(); }
    });
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) { currentIndex--; updateSliderPosition(); updateButtonStates(); }
    });
    let resizeTimer; window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(updateSlidesToShow, 150); });
    console.log(`Initial Total Slides found: ${totalSlides}`);
    updateSlidesToShow();
    console.log("Blog slider initialized successfully inside footer.");
}


// ============================================
// HÀM includeHTML (SỬA ĐỔI ĐỂ DÙNG getBasePath)
// ============================================
function includeHTML(fileName, targetElementId, callback) { // Đổi tên tham số đầu thành fileName
    const basePath = getBasePath(); // Lấy tiền tố đường dẫn đúng
    const fullPath = basePath + fileName; // Ghép tiền tố với tên file (ví dụ: './header.html' hoặc '../header.html')

    console.log(`Fetching: ${fullPath}`); // Log để kiểm tra đường dẫn cuối cùng

    fetch(fullPath) // Sử dụng đường dẫn đã tính toán
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: ${response.status} for ${fullPath}` // Hiển thị đường dẫn đầy đủ khi lỗi
                );
            }
            return response.text();
        })
        .then((data) => {
            const target = document.getElementById(targetElementId);
            if (target) {
                target.innerHTML = data;
                console.log(`Successfully loaded ${fullPath} into #${targetElementId}`);
                if (typeof callback === "function") {
                    console.log(`Executing callback for ${fileName}`);
                    try { callback(); } catch (e) { console.error(`Error executing callback for ${fileName}:`, e); }
                }
            } else {
                console.error(`Target element with ID "${targetElementId}" not found.`);
            }
        })
        .catch((error) => {
            console.error(`Error fetching or processing ${fullPath}:`, error); // Hiển thị đường dẫn đầy đủ khi lỗi
            const target = document.getElementById(targetElementId);
            if (target) {
                target.innerHTML = `<p style="color: red;">Lỗi khi tải ${fileName}. Chi tiết lỗi xem ở Console (F12).</p>`;
            }
        });
}


// ============================================
// GỌI HÀM ĐỂ CHÈN HTML (GIỮ NGUYÊN NHƯ CŨ - Chỉ cần tên file)
// ============================================

// Chèn header (hàm includeHTML sẽ tự động thêm './' hoặc '../' vào trước 'header.html')
includeHTML("header.html", "header-placeholder");

// Chèn footer (hàm includeHTML sẽ tự động thêm './' hoặc '../' vào trước 'footer.html')
includeHTML("footer.html", "footer-placeholder", initializeBlogSlider);