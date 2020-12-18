const http = require("http")
const MercadoLivre = require("./services/MercadoLivre")
const MagazineLuiza = require("./services/MagazineLuiza")
const Cache = require("./utils/Cache")

const app = http.createServer(async (req, res)=>{
    const term = req.url.replace("/", "")

    if(term.length < 1) {
        res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'})
        res.write(JSON.stringify("O Termo de busca não foi informado!"))
        return res.end()
    }

    const cachedProducts = Cache.getCache(term);
    if(cachedProducts) {
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})

        res.write(JSON.stringify(cachedProducts))
        return res.end()
    }

    //const products = await MercadoLivre.getProductsByTerm(term);
    const products = await MagazineLuiza.getProductsByTerm(term);

    if(products.error) {
        res.writeHead(503, {'Content-Type': 'application/json; charset=utf-8'})

        res.write(JSON.stringify(products.details))
        return res.end()
    }

    Cache.setCache(term, JSON.stringify(products))

    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})

    res.write(JSON.stringify(products))
    res.end()
})

app.listen(3000, () => {
    console.log("Servidor rodando!")
})