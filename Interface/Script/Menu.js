async function Menu(point) {
    let url = new URL(window.location.href)

    switch (point) {
        case 'NodeSetup':
            url.pathname = '/Interface/NodeSetup.html'
            break

        case 'Schatztruhe':
            url.pathname = '/Interface/Schatztruhe.html'
            break

        case 'MoonBrixInfo':
            url.pathname = '/Interface/MoonBrixInfo.html'
            break

        case 'DSGVO':
            url.pathname = '/Interface/DSGVO.html'
            break

        case 'Litecoin':
            url.pathname = '/Interface/LitecoinWallet.html'
            break
    
        default:
            url.pathname = '/Genesis.html'
            break
    }

    window.location = url
}