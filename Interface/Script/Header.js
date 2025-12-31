Header()

async function Header() {
    const response = await fetch("./Interface/Header.html")
    const result = await response.text()
    document.body.children[0].innerHTML = result

    switch (window.location.href) {
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
    }

    const GUARD = document.getElementById("Guard")

    document.getElementById("Headline").onmouseenter = () => {
        GUARD.style.display = "block"
    }
    document.getElementById("Headline").onmouseleave = () => {
        GUARD.style.display = "none"
    }
}