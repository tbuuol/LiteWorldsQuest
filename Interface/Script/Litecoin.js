class Litecoin {
    constructor() {
        this.network = {
            messagePrefix: '\x19Litecoin Signed Message:\n',
            bip32: { public: 0x01b26ef6, private: 0x01b26792 },
            bech32: 'ltc',
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0
        }

        this.BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        this.root

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


    wifToUint8(wif) {
        // Base58 → BigInt
        let num = 0n;
        for (let c of wif) {
        const index = this.BASE58_ALPHABET.indexOf(c);
        if (index < 0) throw new Error("Invalid Base58 char");
        num = num * 58n + BigInt(index);
        }

        // BigInt → Uint8Array (raw bytes)
        let bytes = [];
        while (num > 0n) {
        bytes.push(Number(num & 0xFFn));
        num >>= 8n;
        }
        bytes = bytes.reverse();

        // führende 1er im Base58 = führende 0x00 bytes
        for (let c of wif) {
        if (c === "1") bytes.unshift(0);
        else break;
        }

        return new Uint8Array(bytes);
    }

    uint8ToWIF(bytes) {
        let num = 0n;

        // Uint8 → BigInt
        for (let b of bytes) {
        num = (num << 8n) + BigInt(b);
        }

        // BigInt → Base58
        let s = "";
        while (num > 0n) {
        let r = num % 58n;
        num = num / 58n;
        s = this.BASE58_ALPHABET[Number(r)] + s;
        }

        // führende 0-Bytes wieder in "1" umwandeln
        for (let b of bytes) {
        if (b === 0) s = "1" + s;
        else break;
        }

        return s;
    }

    AddressesFromSeeds(entrophy) {
        const mnemonic = bip39.entropyToMnemonic(entrophy)
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        this.root = bitcoin.bip32.fromSeed(seed, this.network)

        const array = new Array
        array.Legacy = new Array // Legacy
        array.Omni = new Array // Omni
        array.SegWit = new Array // SegWit

        for (let a = 0; a < 20; a++) {
            const childpkh = this.root.derivePath("m/44'/2'/0'/0/" +a)
            const keypairpkh = bitcoin.payments.p2pkh({ 
                pubkey: childpkh.publicKey, 
                network: this.network 
            })

            const childsh = this.root.derivePath("m/49'/2'/0'/0/" +a)
            const keypairsh = bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2wpkh({ 
                pubkey: childsh.publicKey, 
                network: this.network }), 
                network: this.network
            })

            const childwpkh = this.root.derivePath("m/84'/2'/0'/0/" +a)
            const keypairwpkh = bitcoin.payments.p2wpkh({ 
                pubkey: childwpkh.publicKey, 
                network: this.network 
            })

            array.Legacy.push(keypairpkh.address)
            array.Omni.push(keypairsh.address)
            array.SegWit.push(keypairwpkh.address)
        }

        return array
    }

    AddressesFromWIF(wif) {
        const array = new Array
        array.Legacy = new Array // Legacy
        array.Omni = new Array // Omni
        array.SegWit = new Array // SegWit

        for (let a = 0; a < wif.length; a++) {
        const keypair = bitcoin.ECPair.fromWIF(wif[a], this.network)
        

        const Legacy = bitcoin.payments.p2pkh({ 
            pubkey: keypair.publicKey, 
            network: this.network 
        })

        const Omni = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ 
            pubkey: keypair.publicKey, 
            network: this.network }), 
            network: this.network
        })

        const SegWit = bitcoin.payments.p2wpkh({ 
            pubkey: keypair.publicKey, 
            network: this.network 
        })

        array.Legacy.push(Legacy.address)
        array.Omni.push(Omni.address)
        array.SegWit.push(SegWit.address) 
        }

        return array
    }

}