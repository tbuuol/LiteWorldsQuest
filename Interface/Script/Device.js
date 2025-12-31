if (isMobile()) {
    if (window.location.href.includes('Genesis.html')) {
        document.getElementById("MainStyle").href = "Interface/CSS/mStyle.css"
        document.getElementById("HeaderStyle").href = "Interface/CSS/mHeader.css"
    } else {
        document.getElementById("MainStyle").href = "CSS/mStyle.css"
        document.getElementById("HeaderStyle").href = "CSS/mHeader.css"
    }

    window.addEventListener("load", () => {
        const section = document.querySelector("section");
        const articles = section.querySelectorAll("article");
        const middleIndex = Math.floor(articles.length / 2);
        section.scrollTo({
            left: articles[middleIndex].offsetLeft,
            behavior: "instant"
        })
    })
}

function isMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

async function Header() {
    if (isMobile()) {
        const response = await fetch("https://liteworlds.quest/Interface/mHeader.html")
        const result = await response.text()
        document.body.children[0].innerHTML = result

        document.getElementById("Headline").innerHTML = "Genesis"
        if (window.location.href.includes('Schatztruhe.html')) { document.getElementById("Headline").innerHTML = "Schatztruhe"; Schatztruhe() }
        if (window.location.href.includes('MoonBrixInfo.html')) document.getElementById("Headline").innerHTML = "MoonBrix Info"
        if (window.location.href.includes('DSGVO.html')) document.getElementById("Headline").innerHTML = "DSGVO"
        if (window.location.href.includes('NodeSetup.html')) document.getElementById("Headline").innerHTML = "Setup Guide"
        if (window.location.href.includes('LitecoinWallet.html')) document.getElementById("Headline").innerHTML = "Łitecoin Wallet"
    } else {
        const response = await fetch("https://liteworlds.quest/Interface/Header.html")
        const result = await response.text()
        document.body.children[0].innerHTML = result

        document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - Genesis"
        if (window.location.href.includes('Schatztruhe.html')) { document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - Schatztruhe"; Schatztruhe() }
        if (window.location.href.includes('MoonBrixInfo.html')) document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - MoonBrix Info"
        if (window.location.href.includes('DSGVO.html')) document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - DSGVO"
        if (window.location.href.includes('NodeSetup.html')) document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - Setup Guide"
        if (window.location.href.includes('LitecoinWallet.html')) document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - Litecoin Wallet"
    }

    /*switch (window.location.href) {
        case "https://liteworlds.quest/Interface/Schatztruhe.html":
            document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - Schatztruhe"
            Schatztruhe()
            break;

        case "https://liteworlds.quest/Interface/MoonBrixInfo.html":
            document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - MoonBrix Info"
            break;

        case "https://liteworlds.quest/Interface/DSGVO.html":
            document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - DSGVO"
            break;

        case "https://liteworlds.quest/Interface/NodeSetup.html":
            document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - Setup Guide"
            break;
    
        default:
            document.getElementById("Headline").innerHTML = "ŁiteWorldsQuest - Genesis"
            break;
    }*/

    const GUARD = document.getElementById("Guard")

    document.getElementById("Headline").onmouseenter = () => {
        GUARD.style.display = "block"
    }
    document.getElementById("Headline").onmouseleave = () => {
        GUARD.style.display = "none"
    }
}

Header()