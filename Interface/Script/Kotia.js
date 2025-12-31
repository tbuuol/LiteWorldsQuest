class Kotia {
    MEMPOOL
    COINPAPRIKA
    ADDRESSES
    EXBITRON

    constructor() {
        this.MEMPOOL = "https://blockexplorer.kotia.cash/ext/getbalance/KaxCCHGSveYy75UknFdXegyJs9wCuTYazw"
        //this.COINPAPRIKA = "https://api.coinpaprika.com/v1/tickers/ltc-litecoin"
        this.EXBITRON = "https://api.exbitron.com/api/v1/trading/info/KOT-USDT"
        this.ADDRESSES = [
            "KaxCCHGSveYy75UknFdXegyJs9wCuTYazw", // Schatztruhe
            "KgEsrEFCeidgfRxh4YR3GpcEfkvBuPgBij" // Stake0
        ]
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
        const response = await fetch(this.EXBITRON)
        const result = await response.json()
        //console.log(result.data.market.marketDynamics.lastPrice)

        return parseFloat(result.data.market.marketDynamics.lastPrice)
    }
}