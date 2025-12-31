class Litecoin {
    MEMPOOL
    COINPAPRIKA

    constructor() {
        this.MEMPOOL = "https://litecoinspace.org/api/address/ltc1q8efhd0pekgttgw23xuracy68fj4vw6snjxk9l9/utxo"
        this.COINPAPRIKA = "https://api.coinpaprika.com/v1/tickers/ltc-litecoin"
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
        const response = await fetch("https://litecoinspace.org/api/blocks")
        const result = await response.json()

        return result[0]
    }
}