const cheerio = require('cheerio');
const axios = require('axios');

const baseUrl = 'https://books.toscrape.com/catalogue/category/books/mystery_3/';
const book_data = [];

async function getBooks(url) {
    try {
        const response = await axios.get(url); // get the html of the page
        const $ = cheerio.load(response.data); // load the html into cheerio

        $("article").each(function() {
            const title = $(this).find("h3 a").text();
            const price = $(this).find(".price_color").text();
            const stock = $(this).find(".availability").text().trim();

            book_data.push({
                title,
                price,
                stock
            });
        });

        if ($(".next a").length > 0) {
            const next_page = baseUrl + $(".next a").attr("href");
            await getBooks(next_page); // Wait for the recursive call to complete
        }
    } catch (error) {
        console.error(error);
    }
}

// Start scraping from the first page
getBooks(baseUrl + 'index.html').then(() => {
    console.log(book_data); // Log the data after all pages have been processed
});
