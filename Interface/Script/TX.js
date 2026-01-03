class TX {
    constructor() {

    }

    SendSeed(LTC, Addresses, UTXO, adrType, Index, fee = 1) {
        const origin = Addresses[Index]
        const destination = document.getElementById("destination").value
        const amount = document.getElementById("amount").value * 100000000
        const utxos = UTXO[Index]

        let ustx = LTC.Send(origin, destination, amount, utxos, 0)
        let stx = LTC.Sign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        ustx = LTC.Send(origin, destination, amount, utxos, stx.virtualSize() * fee +1)
        stx = LTC.Sign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        return stx.toHex()
    }

    SendAllSeed(LTC, UTXO, adrType, Index, fee = 1) {
        const utxos = UTXO[Index]
        const destination = document.getElementById("destination").value

        let ustx = LTC.SendAll(destination, utxos, 0)
        let stx = LTC.Sign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        ustx = LTC.SendAll(destination, utxos, stx.virtualSize() * fee +1)
        stx = LTC.Sign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        return stx.toHex()
    }

    SendPK(LTC, Addresses, UTXO, adrType, Index, wif, fee = 1) {
        const origin = Addresses[Index]
        const destination = document.getElementById("PKdestination").value
        const amount = document.getElementById("PKamount").value * 100000000
        const utxos = UTXO[Index]

        wif = LTC.uint8ToWIF(wif[Index])

        let ustx = LTC.Send(origin, destination, amount, utxos, 0)
        let stx = LTC.SignPK(ustx.buildIncomplete().toHex(), adrType, utxos, wif)

        ustx = LTC.Send(origin, destination, amount, utxos, stx.virtualSize() * fee +1)
        stx = LTC.SignPK(ustx.buildIncomplete().toHex(), adrType, utxos, wif)

        return stx.toHex()
    }

    SendAllPK(LTC, UTXO, adrType, Index, wif, fee = 1) {
        const utxos = UTXO[Index]
        const destination = document.getElementById("PKdestination").value

        wif = LTC.uint8ToWIF(wif[Index])

        let ustx = LTC.SendAll(destination, utxos, 0)
        let stx = LTC.SignPK(ustx.buildIncomplete().toHex(), adrType, utxos, wif)

        ustx = LTC.SendAll(destination, utxos, stx.virtualSize() * fee +1)
        stx = LTC.SignPK(ustx.buildIncomplete().toHex(), adrType, utxos, wif)

        return stx.toHex()
    }
}