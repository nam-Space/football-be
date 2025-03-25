const { default: axios } = require("axios");
const cheerio = require('cheerio');

const fetchFullContent = async (url) => {
    try {
        // Lấy nội dung HTML của trang
        const { data } = await axios.get(url);

        if (!data) {
            return null;
        }

        // Tải HTML vào cheerio để xử lý
        const $ = cheerio.load(data);

        // Loại bỏ phần header và footer
        $('header').remove(); // Loại bỏ thẻ <header>
        $('footer').remove(); // Loại bỏ thẻ <footer>

        // Lưu lại HTML đã xử lý vào file
        const processedHTML = $.html();

        // Lưu vào file (hoặc trả về)
        // fs.writeFileSync(`${title}.html`, processedHTML);

        return processedHTML;
    } catch (error) {
        console.error('Error fetching full content:', error);
        return null;
    }
};

module.exports = {
    fetchFullContent
}