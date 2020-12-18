const fetch = require("node-fetch")
const cheerio = require("cheerio")

const MagazineLuiza = {
    name: 'Magazine Luiza',
    baseUrl: "https://magazineluiza.com.br/busca",
    async getProductsByTerm(term) {
        try {
            const response = await fetch(`${this.baseUrl}/${term}`)
            const body = await response.text()
            const $ = cheerio.load(body)
            const listProducts = []
            $('ul.productShowCase li').each((index, element) => {
                const priceHtml = $(element).find('span.price-value').text()
                
                const product = {
                    title: $(element).find("h3.productTitle").text().trim(),
                    price: priceHtml.replace(/\s/g, ""),
                    provider: this.name
                }

                listProducts.push(product)

            })

            return listProducts;
        }
        catch(err) {
            return {
                error: true,
                status: err.status,
                details: err.message
            }
        }
    }
}

module.exports = MagazineLuiza