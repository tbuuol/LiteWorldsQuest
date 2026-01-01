class TX {
    constructor() {

    }

    SeedSend(origin, destination, amount, utxos, fee, network) {
        console.log(origin, destination, amount, utxos, fee, network)

        const txb = new bitcoin.TransactionBuilder(network)

        if (amount < 5400) {
            alert('dust error on sending amount')
            return
        }

        let totalInput = 0
        for (let i = 0; i < utxos.length; i++) {
            const utxo = utxos[i]
            txb.addInput(utxo.txid, utxo.vout)
            totalInput += utxo.value
        }

        if (totalInput < amount + fee) {
            alert('Insufficient funds')
            return
        }

        const change = totalInput - amount - fee;
        if (change < 5400) {
            alert('dust error on change')
            return
        } else {
            txb.addOutput(origin, change)
        }
        txb.addOutput(destination, amount)

        return txb
    }

    SeedSendAll(destination, amount) {
        console.log(destination, amount)
    }
}