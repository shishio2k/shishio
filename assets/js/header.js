// Hàm để tải và chèn HTML
function includeHTML(filePath, targetElementId) {
    fetch(filePath) // Gửi yêu cầu lấy nội dung file
        .then((response) => {
            if (!response.ok) {
                // Kiểm tra xem yêu cầu có thành công không
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Lấy nội dung text của file
        })
        .then((data) => {
            // Chèn nội dung vào phần tử có id tương ứng
            document.getElementById(targetElementId).innerHTML = data;
        })
        .catch((error) => {
            console.error("Error fetching HTML:", error);
            document.getElementById(
                targetElementId
            ).innerHTML = `<p>Lỗi khi tải ${filePath}.</p>`;
        });
}

// Gọi hàm để chèn header
includeHTML("header.html", "header-placeholder");

// ***THÊM DÒNG NÀY ĐỂ CHÈN FOOTER***
includeHTML("footer.html", "footer-placeholder");
// Nếu có footer, bạn cũng gọi tương tự
// includeHTML('footer.html', 'footer-placeholder');
