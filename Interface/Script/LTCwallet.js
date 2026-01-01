Init()

function Init() {
    //console.log(bitcoin, bip39)

    //localStorage.clear()

    let meta = getMeta()
    console.log(meta)

    if (meta == null) {
        Setup()
    } else {
        Login()
    }
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

            //console.log(meta)
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
        localStorage.clear()
        location.reload()
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

        //console.log(entropy, password.value)

        saveEncryptedSeed("Litecoin", entropy, password.value)
        LoginBG.remove()
    }

    const getSeed_btn = document.createElement("button")
    getSeed_btn.innerText = "Get Seed"
    getSeed_btn.onclick = function() {
        const entropy = getEntropy()
        //console.log(entropy)
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

async function GetLitecoin(Meta, password) {
    const LTC = new Litecoin
    const OMNI = new Omnilayer

    if (Meta.Seeds.length > 0) {
        const entrophy = await loadEncryptedSeed(Meta, password)
        const Addresses = LTC.AddressesFromSeeds(entrophy)

        const UTXO = new Array
        UTXO.Legacy = await LTC.UTXO(Addresses.Legacy)
        UTXO.Omni = await LTC.UTXO(Addresses.Omni)

        console.log(Addresses, UTXO)

        const addressList = document.getElementById("Addresses")
        console.log(addressList.innerHTML)
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
            adr.innerText = balance + " LTC - " + address
            adr.dataset.value = address

            addressList.appendChild(adr)
        }

        
        refreshSelects()
    }
}

function Send() {
    const origin = document.getElementById("addressValue").value
    console.log(origin)
}



function refreshSelects() {
    document.querySelectorAll(".custom-select").forEach(select => {
        const trigger = select.querySelector(".select-trigger");
        const valueEl = select.querySelector(".select-value");
        const options = select.querySelector(".select-options");
        const hidden = select.querySelector("input");
        const items = [...options.children];

        function close() {
            select.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
        }

        trigger.addEventListener("click", e => {
            e.stopPropagation();
            const open = select.classList.toggle("open");
            trigger.setAttribute("aria-expanded", open);
        });

        items.forEach(item => {
            item.addEventListener("click", () => {
            items.forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");

            valueEl.textContent = item.textContent;
            hidden.value = item.dataset.value;

            close();
            });
        });

        document.addEventListener("click", close);
    });   
}