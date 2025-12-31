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
    const div = document.createElement("div")
    div.classList.add("Login")
    document.body.appendChild(div)

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
    const div = document.createElement("div")
    div.classList.add("Login")
    document.body.children[1].appendChild(div)

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
            div.remove()
            GetLitecoin(input.value)
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