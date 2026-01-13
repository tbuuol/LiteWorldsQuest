const LTC = new Litecoin
const OMNI = new Omnilayer

const UTXO = new Array
const OmniBalance = new Array
const Addresses = new Array


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
            refreshDEX()

            const refreshBtn = document.getElementById("refreshWallet")
            refreshBtn.onclick = function() {
                SeedWallet(Meta["Litecoin"], input.value)
                KeyWallet(Meta["Litecoin"], input.value)

                refreshDEX()
            }

            if (Meta["Litecoin"].Seeds.length > 0) {
                SeedWallet(Meta["Litecoin"], input.value)

                if (Meta["Litecoin"].Keys.length > 0)
                    KeyWallet(Meta["Litecoin"], input.value, true)
                else
                    document.getElementById("PKselect").children[0].children[0].innerText = "Add a Private Key"
            }
            else if (Meta["Litecoin"].Keys.length > 0) {
                switchWallet()
                KeyWallet(Meta["Litecoin"], input.value)

                document.getElementById("SeedSelect").children[0].children[0].innerText = "Add a Seed"
            } else {
                document.getElementById("SeedSelect").children[0].children[0].innerText = "Add a Seed"
                document.getElementById("PKselect").children[0].children[0].innerText = "Add a Private Key"
            }   
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

        document.getElementById("SeedWallet").style.display = "inline-block"
        document.getElementById("PKWallet").style.display = "none"

        SeedWallet(getMeta()["Litecoin"], password.value)
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

        document.getElementById("SeedWallet").style.display = "none"
        document.getElementById("PKWallet").style.display = "inline-block"

        KeyWallet(getMeta()["Litecoin"], password.value)
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


async function SeedWallet(Meta, password) {
    const entrophy = await loadEncryptedSeed(Meta, password)
    Addresses.Seed = LTC.AddressesFromSeed(entrophy)

    //const UTXO = new Array
    //UTXO.Legacy = await LTC.UTXO(Addresses.Legacy)
    UTXO.Seed = await LTC.UTXO(Addresses.Seed)

    const addressList = document.getElementById("SeedAddresses")
    addressList.innerHTML = ""

    for (let a = 0; a < Addresses.Seed.length; a++) {
        const address = Addresses.Seed[a]
        let balance = 0
        
        for (let b = 0; b < UTXO.Seed[a].length; b++) {
            const utxo = UTXO.Seed[a][b]
            balance += utxo.value
        }

        balance /= 100000000

        const adr = document.createElement("li")
        adr.innerText = balance.toFixed(8) + " LTC - " + address

        adr.dataset.balance = balance
        adr.dataset.index = a

        addressList.appendChild(adr)
    }
    updateSeedWallet()
}

async function updateSeedWallet() {
    const SeedWallet = document.getElementById("SeedSelect")
    const SeedTrigger = SeedWallet.children[0]
    const SeedValue = SeedTrigger.children[0]
    const SeedAddresses = SeedWallet.children[1]
    const SeedAddressList = [...SeedAddresses.children]

    OmniBalance.Seed = await OMNI.getBalanceByAddresses(Addresses.Seed)

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
            SeedValue.dataset.address = item.textContent.split(" - ")[1]
            SeedValue.dataset.balance = item.dataset.balance
            SeedValue.dataset.index = item.dataset.index
            
            if (document.getElementById("SeedWallet").style.display != "none") refreshOmni(OmniBalance.Seed[item.dataset.index], "Seed")
            SeedClose()
        })
    })

    if (SeedAddressList.length > 0) SeedAddressList[0].click()
    else SeedValue.innerText = "Add a Seed"

}


async function KeyWallet(Meta, password) {
    const pkey = await loadEncryptedKey(Meta, password)
    const wif = new Array
    for (let a = 0; a < pkey.length; a++) {
        wif[a] = LTC.uint8ToWIF(pkey[a])
    }

    Addresses.Key = LTC.AddressesFromWIF(wif)
    UTXO.Key = await LTC.UTXO(Addresses.Key)

    const addressList = document.getElementById("KeyAddresses")
    addressList.innerHTML = ""

    for (let a = 0; a < Addresses.Key.length; a++) {
        const address = Addresses.Key[a]
        let balance = 0
        
        for (let b = 0; b < UTXO.Key[a].length; b++) {
            const utxo = UTXO.Key[a][b]
            balance += utxo.value
        }

        balance /= 100000000

        const adr = document.createElement("li")
        adr.innerText = balance.toFixed(8) + " LTC - " + address

        adr.dataset.balance = balance
        adr.dataset.index = a

        addressList.appendChild(adr)          
    }
    updateKeyWallet()
}

async function updateKeyWallet() {
    const PKWallet = document.getElementById("KeySelect")
    const PKTrigger = PKWallet.children[0]
    const PKValue = PKTrigger.children[0]
    const PKAddresses = PKWallet.children[1]
    const PKAddressList = [...PKAddresses.children]

    OmniBalance.Key = await OMNI.getBalanceByAddresses(Addresses.Key)

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
            PKValue.dataset.address = item.textContent.split(" - ")[1]
            PKValue.dataset.balance = item.dataset.balance
            PKValue.dataset.index = item.dataset.index

            if (document.getElementById("KeyWallet").style.display != "none") refreshOmni(OmniBalance.Key[item.dataset.index], "Key")
            PKClose()
        })
    })

    if (PKAddressList.length > 0) PKAddressList[0].click()
}


async function refreshOmni(Balance, wallet) {
    const OmniWallet = document.getElementById("OmniSelect")
    const OmniTrigger = OmniWallet.children[0]
    const OmniValue = OmniTrigger.children[0]
    const OmniList = OmniWallet.children[1]
    const IDs = new Array

    OmniList.innerHTML = ""

    for (let a = 0; a < Balance.length; a++) {
        IDs.push(Balance[a].propertyid)
    }

    o = await OMNI.getProperties(IDs)

    for (let a = 0; a < o.length; a++) {
        const element = o[a]        
        const item = document.createElement("li")

        item.innerText = element.propertyid + " - " + element.name
        item.dataset.id = element.propertyid
        item.dataset.name = element.name
        item.dataset.balance = Balance[a].balance
        item.dataset.category = element.category
        item.dataset.subcategory = element.subcategory
        item.dataset.data = element.data
        item.dataset.totaltokens = element.totaltokens

        if (element["non-fungibletoken"]) item.dataset.type = "NFT"
        else if (element.managedissuance) item.dataset.type = "Managed Supply"
        else item.dataset.type = "Fixed Supply"

        OmniList.appendChild(item)
    }

    const OmniListItems = [...OmniList.children]

    function OmniClose() {
        OmniWallet.classList.remove("open")
        OmniTrigger.setAttribute("aria-expanded", "false")
    }

    if (!OmniTrigger._clickBound) {
        OmniTrigger._clickBound = true

        OmniTrigger.addEventListener("click", e => {
            e.stopPropagation()
            const open = OmniWallet.classList.toggle("open")
            OmniTrigger.setAttribute("aria-expanded", open)
        })

        document.addEventListener("click", OmniClose)
    }

    OmniListItems.forEach(item => {
        item.addEventListener("click", async function() {
            OmniListItems.forEach(i => i.classList.remove("selected"))
            item.classList.add("selected")

            OmniValue.textContent = item.textContent
            //propertyID = item.dataset.propertyID

            document.getElementById("oID").innerText = item.dataset.id
            document.getElementById("oName").innerText = item.dataset.name
            document.getElementById("oBalance").innerText = item.dataset.balance

            //const Property = await OMNI.getProperty(item.dataset.propertyID)

            document.getElementById("oCategory").innerText = item.dataset.category
            document.getElementById("oSubCategory").innerText = item.dataset.subcategory
            document.getElementById("oSupply").innerText = item.dataset.totaltokens

            document.getElementById("oData").innerText = item.dataset.data
            document.getElementById("oType").innerText = item.dataset.type


            const Odesti = document.getElementById("OmniDestination")
            Odesti.innerHTML = ""

            const Obtn = document.getElementById("OmniBTN")
            Obtn.innerHTML = ""

            const destination = document.createElement("input")
            destination.placeholder = "destination"
            destination.style = "width: calc(50dvw - 4px);"

            Odesti.appendChild(destination)

            if (item.dataset.type == "NFT") {
                console.log(document.getElementById("oRange").parentNode)

                document.getElementById("oRange").innerHTML = ""
                document.getElementById("oRange").parentNode.style.display = "block"

                const NFTs = await OMNI.getNFTs(document.getElementById(wallet + "Select").children[0].children[0].dataset.address, parseInt(item.dataset.id))
                console.log(NFTs[0].tokens)

                for (let a = 0; a < NFTs[0].tokens.length; a++) {
                    const element = NFTs[0].tokens[a]

                    const range = document.createElement("b")
                    range.innerHTML = element.tokenstart + "-" + element.tokenend + " "
                    
                    document.getElementById("oRange").appendChild(range)
                }

                const token = document.createElement("input")
                token.type = "amount"
                token.placeholder = "tokenID"
                token.step = "1"
                token.style = "width: calc(50dvw - 4px);"

                Odesti.appendChild(token)

                const send_btn = document.createElement("button")
                send_btn.innerText = "Send NFT"
                send_btn.onclick = async function() {
                    const payload = await OMNI.OPsendNFT(parseInt(item.dataset.id), parseInt(token.value))
                    console.log(payload)
                    const origin = document.getElementById(wallet + "Select").children[0].children[0].dataset.address
                    const index = document.getElementById(wallet + "Select").children[0].children[0].dataset.index
                    const TXB = new TX

                    if (wallet == "Seed") {
                        const tx = TXB.TokenSend(LTC, origin, destination.value, payload, UTXO[wallet][index], LTC.GetWifFromSeedAddress(index))

                        if (confirm("Submit TX?")) {
                            LTC.submitTX(tx)
                            document.getElementById("refreshWallet").click()
                        }
                    } else {
                        console.log(wallet)
                        EnterPassword()

                        const Meta = getMeta()

                        document.getElementById("KeyConfirm").onclick = async function() {
                            const password = document.getElementById("KeyConfirmInput").value

                            if (await SHA256(password) != Meta.Password) {
                                alert("password wrong!")
                            } else {
                                const TXB = new TX
                                const wif = LTC.uint8ToWIF((await loadEncryptedKey(Meta["Litecoin"], password))[index])
                                console.log(LTC, origin, destination.value, payload, UTXO[wallet][index], wif)
                                const tx = TXB.TokenSend(LTC, origin, destination.value, payload, UTXO[wallet][index], wif)
                                console.log(tx)

                                LTC.submitTX(tx)
                                
                                document.getElementById("refreshWallet").click()
                                document.getElementById("KeyConfirmInput").value = ""
                                document.getElementById("KeyConfirmDiv").remove()
                            }
                        }
                    }
                    
                }

                Obtn.appendChild(send_btn)
            } else {
                document.getElementById("oRange").parentNode.style.display = "none"

                const amount = document.createElement("input")
                amount.type = "number"
                amount.placeholder = "amount"
                amount.style = "width: calc(50dvw - 4px);"

                Odesti.appendChild(amount)


                const send_btn = document.createElement("button")
                send_btn.innerText = "Send Token"
                send_btn.onclick = async function() {
                    const payload = await OMNI.OPsimpleSend(parseInt(item.dataset.id), amount.value)
                    const origin = document.getElementById(wallet + "Select").children[0].children[0].dataset.address
                    const index = document.getElementById(wallet + "Select").children[0].children[0].dataset.index
                    const TXB = new TX

                    if (wallet == "Seed") {
                        const tx = TXB.TokenSend(LTC, origin, destination.value, payload, UTXO[wallet][index], LTC.GetWifFromSeedAddress(index))

                        if (confirm("Submit TX?")) {
                            LTC.submitTX(tx)
                            document.getElementById("refreshWallet").click()
                        }
                    } else {
                        console.log(wallet)
                        EnterPassword()

                        const Meta = getMeta()

                        document.getElementById("KeyConfirm").onclick = async function() {
                            const password = document.getElementById("KeyConfirmInput").value

                            if (await SHA256(password) != Meta.Password) {
                                alert("password wrong!")
                            } else {
                                const TXB = new TX
                                const wif = LTC.uint8ToWIF((await loadEncryptedKey(Meta["Litecoin"], password))[index])
                                console.log(LTC, origin, destination.value, payload, UTXO[wallet][index], wif)
                                const tx = TXB.TokenSend(LTC, origin, destination.value, payload, UTXO[wallet][index], wif)
                                console.log(tx)

                                LTC.submitTX(tx)
                                
                                document.getElementById("refreshWallet").click()
                                document.getElementById("KeyConfirmInput").value = ""
                                document.getElementById("KeyConfirmDiv").remove()
                            }
                        }
                    }
                    
                }

                Obtn.appendChild(send_btn)
            }

            OmniClose()
        })
    })

    if (OmniListItems.length > 0) OmniListItems[0].click()
}

async function refreshDEX() {
    DEX = await OMNI.getDEX()

    const DEXWallet = document.getElementById("DEXSelect")
    const DEXTrigger = DEXWallet.children[0]
    const DEXValue = DEXTrigger.children[0]
    const DEXList = DEXWallet.children[1]
    const DEXids = new Array

    DEXList.innerHTML = ""


    for (let a = 0; a < DEX.length; a++) {
        const element = DEX[a].propertyid
        
        DEXids.push(element)
    }

    const DEXproperties = await OMNI.getProperties(DEXids)

    for (let a = 0; a < DEX.length; a++) {
        const element = DEX[a]

        const Property = DEXproperties[a]
        
        const item = document.createElement("li")
        item.innerText = element.propertyid + " - " + Property.name

        item.dataset.propertyID = element.propertyid
        item.dataset.amountavailable = element.amountavailable
        item.dataset.unitprice = element.unitprice

        DEXList.appendChild(item)
    }

    const DEXListItems = [...DEXList.children]

    function DEXClose() {
        DEXWallet.classList.remove("open")
        DEXTrigger.setAttribute("aria-expanded", "false")
    }

    if (!DEXTrigger._clickBound) {
        DEXTrigger._clickBound = true

        DEXTrigger.addEventListener("click", e => {
            e.stopPropagation()
            const open = DEXWallet.classList.toggle("open")
            DEXTrigger.setAttribute("aria-expanded", open)
        })

        document.addEventListener("click", DEXClose)
    }

    DEXListItems.forEach(item => {
        item.addEventListener("click", async function() {
            DEXListItems.forEach(i => i.classList.remove("selected"))
            item.classList.add("selected")

            DEXValue.textContent = item.textContent
            DEXpropertyID = item.dataset.propertyID

            document.getElementById("dBalance").innerText = item.dataset.amountavailable
            document.getElementById("dPrice").innerText = item.dataset.unitprice + " LTC"

            const Property = await OMNI.getProperty(item.dataset.propertyID)

            document.getElementById("dID").innerText = Property.propertyid
            document.getElementById("dName").innerText = Property.name

            document.getElementById("dCategory").innerText = Property.category
            document.getElementById("dSubCategory").innerText = Property.subcategory
            document.getElementById("dSupply").innerText = Property.totaltokens

            document.getElementById("dData").innerText = Property.data

            if (Property["non-fungibletoken"]) document.getElementById("dType").innerText = "NFT"
            else if (Property.managedissuance)document.getElementById("dType").innerText = "Managed Supply"
            else document.getElementById("dType").innerText = "Fixed Supply"

            DEXClose()
        })
    })

    if (DEXListItems.length > 0) DEXListItems[0].click()
}


function switchWallet() {
    const SeedWallet = document.getElementById("SeedWallet")
    const PKWallet = document.getElementById("KeyWallet")

    if (SeedWallet.style.display == "inline-block") {
        SeedWallet.style.display = "none"
        PKWallet.style.display = "inline-block"
        refreshOmni(OmniBalance.Key[document.getElementById("KeySelect").children[0].children[0].dataset.index], "Key")
    } else {
        SeedWallet.style.display = "inline-block"
        PKWallet.style.display = "none"
        refreshOmni(OmniBalance.Seed[document.getElementById("SeedSelect").children[0].children[0].dataset.index], "Seed")
    }
}

function switchOmni() {
    const OmniWallet = document.getElementById("OmniWallet")
    const DEX = document.getElementById("DEX")

    if (OmniWallet.style.display == "inline-block") {
        OmniWallet.style.display = "none"
        DEX.style.display = "inline-block"
    } else {
        OmniWallet.style.display = "inline-block"
        DEX.style.display = "none"
    }
}


function SendBtn(wallet) {
    const TXB = new TX
    const index = document.getElementById(wallet + "Select").children[0].children[0].dataset.index
    const destination = document.getElementById(wallet + "Destination").value
    const amount = document.getElementById(wallet + "Amount").value * 100000000

    if (wallet == "Seed") {
        const tx = TXB.Send(LTC, Addresses[wallet][index], destination, amount, UTXO[wallet][index], LTC.GetWifFromSeedAddress(index))

        if (confirm("Submit TX?")) {
            LTC.submitTX(tx)
            document.getElementById("refreshWallet").click()
        }
    } else {
        EnterPassword()

        const Meta = getMeta()

        document.getElementById("KeyConfirm").onclick = async function() {
            const password = document.getElementById("KeyConfirmInput").value

            if (await SHA256(password) != Meta.Password) {
                alert("password wrong!")
            } else {
                const TXB = new TX
                const wif = LTC.uint8ToWIF((await loadEncryptedKey(Meta["Litecoin"], password))[index])
                const tx = TXB.Send(LTC, Addresses.Key[index], destination, amount, UTXO.Key[index], wif)

                LTC.submitTX(tx)
                
                document.getElementById("refreshWallet").click()
                document.getElementById("KeyConfirmInput").value = ""
                document.getElementById("KeyConfirmDiv").remove()
            }
        }
    }
}

function SendAllBtn(wallet) {
    const TXB = new TX
    const index = document.getElementById(wallet + "Select").children[0].children[0].dataset.index
    const destination = document.getElementById(wallet + "Destination").value

    if (wallet == "Seed") {
        const tx = TXB.SendAll(LTC, destination, UTXO[wallet][index], LTC.GetWifFromSeedAddress(index))

        if (confirm("Submit TX?")) {
            LTC.submitTX(tx)
            document.getElementById("refreshWallet").click()
        }
    } else {
        EnterPassword()

        const Meta = getMeta()

        document.getElementById("KeyConfirm").onclick = async function() {
            const password = document.getElementById("KeyConfirmInput").value

            if (await SHA256(password) != Meta.Password) {
                alert("password wrong!")
            } else {
                const TXB = new TX
                const wif = LTC.uint8ToWIF((await loadEncryptedKey(Meta["Litecoin"], password))[index])
                const tx = TXB.SendAll(LTC, destination, UTXO.Key[index], wif)

                LTC.submitTX(tx)

                document.getElementById("refreshWallet").click()
                document.getElementById("KeyConfirmInput").value = ""
                document.getElementById("KeyConfirmDiv").remove()
            }
        }
    }
}

function CopyAddressBtn(wallet) {
    const index = document.getElementById(wallet + "Select").children[0].children[0].dataset.index

    navigator.clipboard.writeText(Addresses[wallet][index])
    document.getElementById(wallet + "CopyBtn").innerText = "copied!"

    setTimeout(() => {
        document.getElementById(wallet + "CopyBtn").innerText = "Copy Address"
    }, 1337);
}

function EnterPassword() {
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
    div.id = "KeyConfirmDiv"
    div.style.padding = "3.7rem"
    div.style.border = "1px solid #0f0"
    div.style.borderRadius = "9px"

    input.placeholder = "Enter Password"
    input.type = "password"
    input.id = "KeyConfirmInput"
    
    confirm.innerText = "Send"
    confirm.id = "KeyConfirm"
    /*confirm.onclick = async function() {
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
    }*/

    cancel.innerText = "Cancel"
    cancel.onclick = function() {
        div.remove()
    }
}
