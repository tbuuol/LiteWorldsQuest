Init()

async function Init() {
    //console.log(window.location)
    

    document.addEventListener('contextmenu', function(event)
    {
        event.preventDefault()
    })
}

async function Schatztruhe() {
    const BITCOIN = new Bitcoin()
    const LITECOIN = new Litecoin()

    const PRICEBTC = (await BITCOIN.Price()).toFixed(4)
    const PRICELTC = (await LITECOIN.Price()).toFixed(4)

    const BALANCEBTC = document.getElementById("BalanceBTC")
    const BALANCEBTCUSD = document.getElementById("BalanceBTCUSD")

    const BALANCELTC = document.getElementById("BalanceLTC")
    const BALANCELTCUSD = document.getElementById("BalanceLTCUSD")

    const TOTAL = document.getElementById("Total")


    BALANCEBTC.innerHTML = await BITCOIN.Balance()
    BALANCEBTCUSD.innerHTML = (parseFloat(BALANCEBTC.innerHTML) * PRICEBTC).toFixed(4)
    
    BALANCELTC.innerHTML = await LITECOIN.Balance()
    BALANCELTCUSD.innerHTML = (parseFloat(BALANCELTC.innerHTML) * PRICELTC).toFixed(4)
    
    TOTAL.innerHTML = (parseFloat(BALANCEBTCUSD.innerHTML) + parseFloat(BALANCELTCUSD.innerHTML)).toFixed(4)

    // Supply Ratio 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin'

    const SUPPLYBTC = await BITCOIN.Supply()
    const SUPPLYLTC = await LITECOIN.Supply()

    document.getElementById("SupplyBTC").innerText = new Intl.NumberFormat("en-US").format(SUPPLYBTC)
    document.getElementById("SupplyLTC").innerText = new Intl.NumberFormat("en-US").format(SUPPLYLTC)
    document.getElementById("SupplyRatio").innerText = "1:" + (SUPPLYLTC / SUPPLYBTC).toFixed(4)
    document.getElementById("PriceRatio").innerText = " 1:" + (PRICEBTC / PRICELTC).toFixed(4)
    
    document.getElementById("toMineBTC").innerText = new Intl.NumberFormat("en-US").format(21000000 - SUPPLYBTC)
    document.getElementById("toMineLTC").innerText = new Intl.NumberFormat("en-US").format(84000000 - SUPPLYLTC)

    const LASTBLOCKBTC = await BITCOIN.LastBlock()
    const LASTBLOCKLTC = await LITECOIN.LastBlock()

    const HeightBTC = LASTBLOCKBTC.height
    const HeightLTC = LASTBLOCKLTC.height

    const BTChalving = 210000
    const LTChalving = 840000

    let BTCMineReward  = 50, LTCMineReward = 50

    for (let a = 0; a < parseInt(HeightBTC / BTChalving); a++) {
        BTCMineReward = BTCMineReward / 2
    }

    for (let a = 0; a < parseInt(HeightLTC / LTChalving); a++) {
        LTCMineReward = LTCMineReward / 2
    }

    console.log(BTCMineReward, LTCMineReward)

    document.getElementById("BlocksTillHalvingBTC").innerText = new Intl.NumberFormat("en-US").format((parseInt(HeightBTC / BTChalving) + 1) * BTChalving - HeightBTC) + " (in " + parseInt(((parseInt(HeightBTC / BTChalving) + 1) * BTChalving - HeightBTC) / 144) + " Tagen)"
    document.getElementById("BlocksTillHalvingLTC").innerText = new Intl.NumberFormat("en-US").format((parseInt(HeightLTC / LTChalving) + 1) * LTChalving - HeightLTC) + " (in " + parseInt(((parseInt(HeightLTC / LTChalving) + 1) * LTChalving - HeightLTC) / 576) + " Tagen)"

    document.getElementById("RewardBTC").innerText = BTCMineReward + " alle 10 Minuten (" + new Intl.NumberFormat("en-US").format((BTCMineReward * PRICEBTC).toFixed(4)) + " USD)"
    document.getElementById("RewardLTC").innerText = LTCMineReward + " alle 2.5 Minuten (" + new Intl.NumberFormat("en-US").format((LTCMineReward * PRICELTC).toFixed(4)) + " USD)"

    document.getElementById("RewardTillHalvingBTC").innerText = new Intl.NumberFormat("en-US").format(((parseInt(HeightBTC / BTChalving) + 1) * BTChalving - HeightBTC) * BTCMineReward) + " (" + new Intl.NumberFormat("en-US").format(((((parseInt(HeightBTC / BTChalving) + 1) * BTChalving - HeightBTC) * BTCMineReward) * PRICEBTC).toFixed(4)) + " USD)"
    document.getElementById("RewardTillHalvingLTC").innerText = new Intl.NumberFormat("en-US").format(((parseInt(HeightLTC / LTChalving) + 1) * LTChalving - HeightLTC) * LTCMineReward) + " (" + new Intl.NumberFormat("en-US").format(((((parseInt(HeightLTC / LTChalving) + 1) * LTChalving - HeightLTC) * LTCMineReward) * PRICELTC).toFixed(4)) + " USD)"
}