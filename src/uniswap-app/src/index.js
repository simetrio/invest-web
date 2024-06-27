const { ethers } = require("ethers")
const { uniswap } = require("./libs/uniswap")
const { coins } = require("./libs/coins")
const { html } = require("./libs/html")

window.uniswapAppMain = async function () {
    try {
        const config = getConfig()
        if (!config) {
            console.log("Укажите адрес кошелька")
            throw new Error("Укажите адрес кошелька")
        }

        console.log(config.wallet.address)
        setStatus("Загрузка...")

        await Promise.all([loadBalance(config), loadPosition(config)])

        setStatus("Обновить")
    } catch {
        setStatus("Ошибка!!!")
    }
}

function setStatus(status) {
    document.getElementById("refresh").innerText = status
}

function getConfig() {
    if (!location.hash) {
        return
    }

    const walletAddress = location.hash.replace("#", "")

    return {
        NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        wallet: {
            address: walletAddress,
        },
        provider: new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
        coin0: coins.Arbitrum_WETH,
        coin1: coins.Arbitrum_USDC,
    }
}

async function loadBalance(config) {
    const [coin0Balance, coin1Balance, ethBalance] = await Promise.all([
        uniswap.getBalance(config, config.coin0),
        uniswap.getBalance(config, config.coin1),
        uniswap.getEthBalance(config),
    ])

    console.log("Balance", config.coin0.name, coin0Balance)
    console.log("Balance", config.coin1.name, coin1Balance)
    console.log("Balance", "ETH", ethBalance)

    document.getElementById("coin0-name").innerText = config.coin0.name
    document.getElementById("coin0").innerText = coin0Balance
    document.getElementById("coin1-name").innerText = config.coin1.name
    document.getElementById("coin1").innerText = coin1Balance
    document.getElementById("eth").innerText = ethBalance
}

async function loadPosition(config) {
    const [position, priceCurrent] = await Promise.all([
        uniswap.getLastPosition(config),
        uniswap.getPrice(config)
    ])
    console.log("Position", position, position.liquidity.toString())

    document.getElementById("position-number").innerText = position.id

    if (position.liquidity.toString() === "0") {
        console.log("Position closed")
        document.getElementById("position-status").innerText = "Закрыта"
        return
    }

    const priceUpper = uniswap.getPriceFromTick(config, position.tickUpper)
    const priceLower = uniswap.getPriceFromTick(config, position.tickLower)

    const isInRange = priceCurrent > priceLower && priceCurrent < priceUpper
    const isUpper = !isInRange && priceCurrent > priceUpper

    document.getElementById("position-status").innerHTML = isInRange ? html.textGreen("Открыта") : html.textRed("Закрыта")

    let priceHtml = ""
    if (isInRange) {
        priceHtml = `${html.textGray(html.price(priceLower))} &mdash; ${html.textGreen(html.price(priceCurrent))} &mdash; ${html.textGray(html.price(priceUpper))}`
    } else if(isUpper) {
        priceHtml = `${html.textGray(html.price(priceLower))} &mdash; ${html.textGray(html.price(priceUpper))} &mdash; ${html.textRed(html.price(priceCurrent))}`
    } else {
        priceHtml = `${html.textRed(html.price(priceCurrent))} &mdash; ${html.textGray(html.price(priceLower))} &mdash; ${html.textGray(html.price(priceUpper))}`
    }

    document.getElementById("position-price").innerHTML = priceHtml
}

window.uniswapAppMain()