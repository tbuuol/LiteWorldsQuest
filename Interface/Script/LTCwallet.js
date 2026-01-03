const LTC = new Litecoin
const OMNI = new Omnilayer
const UTXO = new Array
const UTXOpk = new Array

var Addresses, Balance, Index
var AddressesPK, BalancePK, IndexPK

Init()

function Init() {
    if (getMeta() == null) Setup()
    else Login()
}

function Setup() {
    const LoginBG = document.createElement("div")
    LoginBG.classList.add("LoginBG")
    document.body.children[1].appendChild(LoginBG)

    const div = document.createElement("div")
    div.classList.add("Login")
    LoginBG.appendChild(div)

    const info = document.createElement("h1")
    info.innerText = "Setup Password"

    const input1 = document.createElement("input")
    input1.placeholder = "Password"
    input1.type = "password"
    const input2 = document.createElement("input")
    input2.placeholder = "repeat Password"
    input2.type = "password"

    const set_btn = document.createElement("button")
    set_btn.innerText = "Set Password"
    set_btn.onclick = async function() {
        if (input1.value == input2.value) {
            meta = {
                "Password": await SHA256(input1.value),
                "Bitcoin":{
                    "Seeds": [],
                    "Keys": [],
                    "Salt": crypto.getRandomValues(new Uint8Array(16)),
                    "IV": crypto.getRandomValues(new Uint8Array(12))
                },
                "Litecoin":{
                    "Seeds": [],
                    "Keys": [],
                    "Salt": crypto.getRandomValues(new Uint8Array(16)),
                    "IV": crypto.getRandomValues(new Uint8Array(12))
                },
                "Dogecoin":{
                    "Seeds": [],
                    "Keys": [],
                    "Salt": crypto.getRandomValues(new Uint8Array(16)),
                    "IV": crypto.getRandomValues(new Uint8Array(12))
                },
                "KotiaCash":{
                    "Seeds": [],
                    "Keys": [],
                    "Salt": crypto.getRandomValues(new Uint8Array(16)),
                    "IV": crypto.getRandomValues(new Uint8Array(12))
                },
                "FairBrix":{
                    "Seeds": [],
                    "Keys": [],
                    "Salt": crypto.getRandomValues(new Uint8Array(16)),
                    "IV": crypto.getRandomValues(new Uint8Array(12))
                },
                "DogecoinEV":{
                    "Seeds": [],
                    "Keys": [],
                    "Salt": crypto.getRandomValues(new Uint8Array(16)),
                    "IV": crypto.getRandomValues(new Uint8Array(12))
                }
            }

            setMeta(meta)
            location.reload()
        }
        else alert("Passwords missmatch")
    }

    div.appendChild(info)
    div.appendChild(input1)
    div.appendChild(document.createElement("br"))
    div.appendChild(input2)
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createElement("br"))
    div.appendChild(set_btn)
}

function Login() {
    const LoginBG = document.createElement("div")
    LoginBG.classList.add("LoginBG")
    document.body.children[1].appendChild(LoginBG)

    const div = document.createElement("div")
    div.classList.add("Login")
    LoginBG.appendChild(div)

    const info = document.createElement("h1")
    info.innerText = "Login"

    const input = document.createElement("input")
    input.type = "password"
    input.placeholder = "password"

    const login_btn = document.createElement("button")
    login_btn.innerText = "Login"
    login_btn.onclick = async function() {
        const Meta = getMeta()
        const password = await SHA256(input.value)

        if (Meta.Password == password) {
            LoginBG.remove()
            GetLitecoin(Meta["Litecoin"], input.value)
        } else alert("Password missmatch")
    }

    const reset_btn = document.createElement("button")
    reset_btn.innerText = "Reset Wallet"
    reset_btn.onclick = function() {
        if (confirm("Reset Wallet?")) {
           localStorage.clear()
            location.reload() 
        }
    }

    div.appendChild(info)
    div.appendChild(input)
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createElement("br"))
    div.appendChild(login_btn)
    div.appendChild(reset_btn)
}


function addSeed() {
    const LoginBG = document.createElement("div")
    LoginBG.classList.add("LoginBG")
    document.body.children[1].appendChild(LoginBG)

    const div = document.createElement("div")
    div.classList.add("Login")
    LoginBG.appendChild(div)

    const info = document.createElement("h1")
    info.innerText = "Add Seed"

    const seed = document.createElement("textarea")
    seed.classList.add("Seed")
    seed.placeholder = "Enter your Seed here, or click \"Get Seed\""

    const password = document.createElement("input")
    password.placeholder = "password"
    password.type = "password"

    const validate_btn = document.createElement("button")
    validate_btn.innerText = "Continue"
    validate_btn.onclick = async function() {
        const Meta = getMeta()
        if (!bip39.validateMnemonic(seed.value)) {
            alert("Seed invalid!")
            throw "invalid Seed"
        }

        if (Meta.Password != await SHA256(password.value)) {
            alert("Password wrong")
            throw "wrong Password"
        }

        const entropy = hexToUint8Array(bip39.mnemonicToEntropy(seed.value))
        await saveEncryptedSeed("Litecoin", entropy, password.value)
        LoginBG.remove()

        GetLitecoin(getMeta()["Litecoin"], password.value)
    }

    const getSeed_btn = document.createElement("button")
    getSeed_btn.innerText = "Get Seed"
    getSeed_btn.onclick = function() {
        const entropy = getEntropy()
        seed.value = bip39.entropyToMnemonic(entropy)
    }

    const cancel_btn = document.createElement("button")
    cancel_btn.innerText = "Cancel"
    cancel_btn.onclick = function() {
        LoginBG.remove()
    }

    div.appendChild(info)
    div.appendChild(seed)
    div.appendChild(document.createElement("br"))
    div.appendChild(password)
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createElement("br"))
    div.appendChild(validate_btn)
    div.appendChild(getSeed_btn)
    div.appendChild(cancel_btn)
}

function addKey() {
    const LoginBG = document.createElement("div")
    LoginBG.classList.add("LoginBG")
    document.body.children[1].appendChild(LoginBG)

    const div = document.createElement("div")
    div.classList.add("Login")
    LoginBG.appendChild(div)

    const info = document.createElement("h1")
    info.innerText = "Add private Key"

    const WIF = document.createElement("textarea")
    WIF.classList.add("Seed")
    WIF.placeholder = "Enter your Key here"

    const password = document.createElement("input")
    password.placeholder = "password"
    password.type = "password"

    const validate_btn = document.createElement("button")
    validate_btn.innerText = "Continue"
    validate_btn.onclick = async function() {
        const Meta = getMeta()

        if (Meta.Password != await SHA256(password.value)) {
            alert("Password wrong")
            throw "wrong Password"
        }

        await saveEncryptedKey("Litecoin", LTC.wifToUint8(WIF.value), password.value)
        LoginBG.remove()

        GetLitecoin(getMeta()["Litecoin"], password.value)
    }

    const cancel_btn = document.createElement("button")
    cancel_btn.innerText = "Cancel"
    cancel_btn.onclick = function() {
        LoginBG.remove()
    }

    div.appendChild(info)
    div.appendChild(WIF)
    div.appendChild(document.createElement("br"))
    div.appendChild(password)
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createElement("br"))
    div.appendChild(validate_btn)
    div.appendChild(cancel_btn)
}

async function GetLitecoin(Meta, password) {
    const refreshBtn = document.getElementById("refreshWallet")
    refreshBtn.onclick = function() {
        GetLitecoin(Meta, password)
    }

    
    if (Meta.Seeds.length > 0) {
        const entrophy = await loadEncryptedSeed(Meta, password)
        Addresses = LTC.AddressesFromSeed(entrophy)

        //const UTXO = new Array
        UTXO.Legacy = await LTC.UTXO(Addresses.Legacy)
        UTXO.Omni = await LTC.UTXO(Addresses.Omni)

        const addressList = document.getElementById("SeedAddresses")
        addressList.innerHTML = ""

        for (let a = 0; a < Addresses.Omni.length; a++) {
            const address = Addresses.Omni[a]
            let balance = 0
            
            for (let b = 0; b < UTXO.Omni[a].length; b++) {
                const utxo = UTXO.Omni[a][b]
                balance += utxo.value
            }

            balance /= 100000000

            const adr = document.createElement("li")
            adr.innerText = balance.toFixed(8) + " LTC - " + address

            adr.dataset.balance = balance
            adr.dataset.index = a

            addressList.appendChild(adr)
        }
    }

    if (Meta.Keys.length > 0) {
        const pkey = await loadEncryptedKey(Meta, password)
        const wif = new Array
        for (let a = 0; a < pkey.length; a++) {
            wif[a] = LTC.uint8ToWIF(pkey[a])
            
        }

        AddressesPK = LTC.AddressesFromWIF(wif)
        
        //const UTXO = new Array
        UTXOpk.Legacy = await LTC.UTXO(AddressesPK.Legacy)
        UTXOpk.Omni = await LTC.UTXO(AddressesPK.Omni)

        const addressList = document.getElementById("PKAddresses")
        addressList.innerHTML = ""

        for (let a = 0; a < AddressesPK.Omni.length; a++) {
            const address = AddressesPK.Omni[a]
            let balance = 0
            
            for (let b = 0; b < UTXOpk.Omni[a].length; b++) {
                const utxo = UTXOpk.Omni[a][b]
                balance += utxo.value
            }

            balance /= 100000000

            const adr = document.createElement("li")
            adr.innerText = balance.toFixed(8) + " LTC - " + address

            adr.dataset.balance = balance
            adr.dataset.index = a

            addressList.appendChild(adr)
        }
    }

    refreshWallets()
}

function seedSendBtn() {
    const TXB = new TX
    const tx = TXB.SendSeed(LTC, Addresses.Omni, UTXO.Omni, 49, Index)

    if (confirm("Submit TX?")) {
        LTC.submitTX(tx)
        document.getElementById("refreshWallet").click()
    }
}

function seedSendAllBtn() {
    const TXB = new TX
    const tx = TXB.SendAllSeed(LTC, UTXO.Omni, 49, Index)

    if (confirm("Submit TX?")) {
        LTC.submitTX(tx)
        document.getElementById("refreshWallet").click()
    }
}

function copyAddressBtn() {
    navigator.clipboard.writeText(Addresses.Omni[Index])
    document.getElementById("copyBtn").innerText = "copied!"

    setTimeout(() => {
        document.getElementById("copyBtn").innerText = "Copy Address"
    }, 1337);
}


function pkSendBtn() {
    const Meta = getMeta()
    let password

    const div = document.createElement("div")
    const input = document.createElement("input")
    const confirm = document.createElement("button")
    const cancel = document.createElement("button")

    document.body.children[1].appendChild(div)
    div.appendChild(input)
    div.appendChild(confirm)
    div.appendChild(cancel)

    div.style.position = "absolute"
    div.style.top = "50dvh"
    div.style.left = "50dvw"
    div.style.transform = "translate(-50%, -50%)"
    div.style.background = "#222"

    input.placeholder = "Enter Password"
    input.type = "password"
    
    confirm.innerText = "Send"
    confirm.onclick = async function() {
        password = input.value

        if (await SHA256(password) != Meta.Password) {
            alert("password wrong!")
        } else {
            const TXB = new TX
            const wif = await loadEncryptedKey(Meta["Litecoin"], password)

    
            const tx = TXB.SendPK(LTC, AddressesPK.Omni, UTXOpk.Omni, 49, IndexPK, wif)
            LTC.submitTX(tx)
            document.getElementById("refreshWallet").click()

            input.value = ""
            div.remove()
        }
    }

    cancel.innerText = "Cancel"
    cancel.onclick = function() {
        div.remove()
    }
}

function pkSendAllBtn() {
    const Meta = getMeta()
    let password

    const div = document.createElement("div")
    const input = document.createElement("input")
    const confirm = document.createElement("button")
    const cancel = document.createElement("button")

    document.body.children[1].appendChild(div)
    div.appendChild(input)
    div.appendChild(confirm)
    div.appendChild(cancel)

    div.style.position = "absolute"
    div.style.top = "50dvh"
    div.style.left = "50dvw"
    div.style.transform = "translate(-50%, -50%)"
    div.style.background = "#222"

    input.placeholder = "Enter Password"
    input.type = "password"
    
    confirm.innerText = "Send"
    confirm.onclick = async function() {
        password = input.value

        if (await SHA256(password) != Meta.Password) {
            alert("password wrong!")
        } else {
            const wif = await loadEncryptedKey(Meta["Litecoin"], password)

            const TXB = new TX
            const tx = TXB.SendAllPK(LTC, UTXOpk.Omni, 49, IndexPK, wif)

            LTC.submitTX(tx)
            document.getElementById("refreshWallet").click()

            input.value = ""
            div.remove()
        }
    }

    cancel.innerText = "Cancel"
    cancel.onclick = function() {
        div.remove()
    }
}

function pkCopyAddressBtn() {
    navigator.clipboard.writeText(AddressesPK.Omni[IndexPK])
    document.getElementById("PKcopyBtn").innerText = "copied!"

    setTimeout(() => {
        document.getElementById("PKcopyBtn").innerText = "Copy Address"
    }, 1337);
}


function switchWallet() {
    const SeedWallet = document.getElementById("SeedWallet")
    const PKWallet = document.getElementById("PKWallet")

    if (SeedWallet.style.display == "inline-block") {
        SeedWallet.style.display = "none"
        PKWallet.style.display = "inline-block"
    } else {
        SeedWallet.style.display = "inline-block"
        PKWallet.style.display = "none"
    }
}

function refreshWallets() {
    const SeedWallet = document.getElementById("SeedSelect")
    const SeedTrigger = SeedWallet.children[0]
    const SeedValue = SeedTrigger.children[0]
    const SeedAddresses = SeedWallet.children[1]
    const SeedAddressList = [...SeedAddresses.children]

    function SeedClose() {
        SeedWallet.classList.remove("open")
        SeedTrigger.setAttribute("aria-expanded", "false")
    }

    if (!SeedTrigger._clickBound) {
        SeedTrigger._clickBound = true

        SeedTrigger.addEventListener("click", e => {
            e.stopPropagation()
            const open = SeedWallet.classList.toggle("open")
            SeedTrigger.setAttribute("aria-expanded", open)
        })

        document.addEventListener("click", SeedClose)
    }

    SeedAddressList.forEach(item => {
        item.addEventListener("click", () => {
            SeedAddressList.forEach(i => i.classList.remove("selected"))
            item.classList.add("selected")

            SeedValue.textContent = item.textContent
            Balance = item.dataset.balance
            Index = item.dataset.index

            SeedClose()
        })
    })

    if (SeedAddressList.length > 0) SeedAddressList[0].click()


    
    const PKWallet = document.getElementById("PKselect")
    const PKTrigger = PKWallet.children[0]
    const PKValue = PKTrigger.children[0]
    const PKAddresses = PKWallet.children[1]
    const PKAddressList = [...PKAddresses.children]

    function PKClose() {
        PKWallet.classList.remove("open")
        PKTrigger.setAttribute("aria-expanded", "false")
    }

    if (!PKTrigger._clickBound) {
        PKTrigger._clickBound = true

        PKTrigger.addEventListener("click", e => {
            e.stopPropagation()
            const open = PKWallet.classList.toggle("open")
            PKTrigger.setAttribute("aria-expanded", open)
        })

        document.addEventListener("click", PKClose)
    }

    PKAddressList.forEach(item => {
        item.addEventListener("click", () => {
            PKAddressList.forEach(i => i.classList.remove("selected"))
            item.classList.add("selected")

            PKValue.textContent = item.textContent
            BalancePK = item.dataset.balance
            IndexPK = item.dataset.index

            SeedClose()
        })
    })

    if (PKAddressList.length > 0) PKAddressList[0].click()
}