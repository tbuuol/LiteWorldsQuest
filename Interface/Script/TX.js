class TX {
    constructor() {

    }

    SendSeed(LTC, Addresses, UTXO, adrType, Index, fee = 1) {
        const origin = Addresses[Index]
        const destination = document.getElementById("destination").value
        const amount = document.getElementById("amount").value * 100000000
        const utxos = UTXO[Index]

        let ustx = LTC.SeedSend(origin, destination, amount, utxos, 0)
        let stx = LTC.SeedSign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        ustx = LTC.SeedSend(origin, destination, amount, utxos, stx.virtualSize() * fee +1)
        stx = LTC.SeedSign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        console.log(stx.toHex(), stx.virtualSize())

        return stx.toHex()
    }

    SendAllSeed(LTC, UTXO, adrType, Index, fee = 1) {
        const utxos = UTXO[Index]
        const destination = document.getElementById("destination").value

        let ustx = LTC.SeedSendAll(destination, utxos, 0)
        let stx = LTC.SeedSign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        ustx = LTC.SeedSendAll(destination, utxos, stx.virtualSize() * fee +1)
        stx = LTC.SeedSign(ustx.buildIncomplete().toHex(), adrType, Index, utxos)

        console.log(stx.toHex(), stx.virtualSize())

        return stx.toHex()
    }

    SeedSign(unsignedHex, addrType, addrIndex, utxos) {
        const tx = bitcoin.Transaction.fromHex(unsignedHex)
        const txb = bitcoin.TransactionBuilder.fromTransaction(tx, this.network)
        const utxoValuesArray = utxos.map(u => u.value)
        const child = this.root.derivePath("m/"+addrType+"'/2'/0'/0/" +addrIndex)
        let addrData

        if (addrType == 44) {
        addrData = bitcoin.payments.p2pkh({ 
            pubkey: child.publicKey,
            network: this.network
        })

        for (let i = 0; i < tx.ins.length; i++) {
            txb.sign(i, child)
        }
        }

        if (addrType == 49) {
        addrData = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
            pubkey: child.publicKey,
            network: this.network }),
            network: this.network
        })

        for (let i = 0; i < tx.ins.length; i++) {
            txb.sign(i, child, addrData.redeem.output, null, utxoValuesArray[i])
        }
        }
        
        return txb.build()
    }
}