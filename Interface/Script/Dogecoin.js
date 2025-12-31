class Dogecoin {
    MEMPOOL
    COINPAPRIKA

    constructor() {
        this.MEMPOOL = "https://www.blockexplorer.com/dogecoin/address/DDTtqnuZ5kfRT5qh2c7sNtqrJmV3iXYdGG"
        this.COINPAPRIKA = "https://api.coinpaprika.com/v1/tickers/doge-dogecoin"
    }

    async Balance() {
        const response = await fetch(this.MEMPOOL)
        console.log(response)
        const result = await response.json()
        console.log(result)

        let balance = 0

        result.forEach(element => {
            balance += element.value
        })

        return balance / 100000000
    }

    async Price() {
        const response = await fetch(this.COINPAPRIKA)
        const result = await response.json()
        console.log(result)

        return parseFloat(result.quotes.USD.price)
    }
}