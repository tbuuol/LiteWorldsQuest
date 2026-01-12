class TX {
    constructor() {

    }

    Send(LTC, origin, destination, amount, UTXO, wif, fee = 1) {
        const size = LTC.Sig(LTC.Send(origin, destination, amount, UTXO, 0).buildIncomplete(), UTXO, wif).virtualSize() * fee +1
        return LTC.Sig(LTC.Send(origin, destination, amount, UTXO, size).buildIncomplete(), UTXO, wif).toHex()
    }

    SendAll(LTC, destination, UTXO, wif, fee = 1) {
        const size = LTC.Sig(LTC.SendAll(destination, UTXO, 0).buildIncomplete(), UTXO, wif).virtualSize() * fee +1
        return LTC.Sig(LTC.SendAll(destination, UTXO, size).buildIncomplete(), UTXO, wif).toHex()
    }

    TokenSend(LTC, origin, destiantion, payload, UTXO, WIF) {
        const OParray = payload.match(/.{2}/g).map(b => parseInt(b, 16))
        const OPreturn = bitcoin.script.compile(OParray)

        let ustx = LTC.Send(origin, destiantion, 5400, UTXO, 0)
        ustx.addOutput(OPreturn, 0)

        let stx = LTC.SignPK(ustx.buildIncomplete().toHex(), 49, UTXO, WIF)

        ustx = LTC.Send(origin, destiantion, 5400, UTXO, stx.virtualSize() +1)
        ustx.addOutput(OPreturn, 0)

        return stx = LTC.SignPK(ustx.buildIncomplete().toHex(), 49, UTXO, WIF)
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