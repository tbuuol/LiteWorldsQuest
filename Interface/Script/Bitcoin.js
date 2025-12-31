class Bitcoin {
    MEMPOOL
    COINPAPRIKA

    constructor() {
        this.MEMPOOL = "https://mempool.space/api/address/bc1q33m7tds866865ln28d5fxry6mkjfhpekkgmthp/utxo"
        this.COINPAPRIKA = "https://api.coinpaprika.com/v1/tickers/btc-bitcoin"
    }

    async Balance() {
        const response = await fetch(this.MEMPOOL)
        const result = await response.json()

        let balance = 0

        result.forEach(element => {
            balance += element.value
        })

        return balance / 100000000
    }

    async Price() {
        const response = await fetch(this.COINPAPRIKA)
        const result = await response.json()

        return parseFloat(result.quotes.USD.price)
    }

    async Supply() {
        const response = await fetch(this.COINPAPRIKA)
        const result = await response.json()

        return parseFloat(result.total_supply)
    }

    async LastBlock() {
        const response = await fetch("https://mempool.space/api/blocks")
        const result = await response.json()

        return result[0]
    }
}