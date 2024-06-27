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

        const data = await loadData(config)
        showBalance(config, data)
        showPosition(config, data)

        setStatus(new Date().toLocaleTimeString())
    } catch {
        setStatus("Ошибка!!!")
    }
}

function setStatus(status) {
    document.getElementById("refresh-status").innerText = status
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

async function loadData(config) {
    const [coin0Balance, coin1Balance, ethBalance, position, priceCurrent] = await Promise.all([
        uniswap.getBalance(config, config.coin0),
        uniswap.getBalance(config, config.coin1),
        uniswap.getEthBalance(config),
        uniswap.getLastPosition(config),
        uniswap.getPrice(config),
    ])

    return {
        coin0Balance,
        coin1Balance,
        ethBalance,
        position,
        priceCurrent,
    }
}

function showBalance(config, data) {
    console.log("Balance", config.coin0.name, data.coin0Balance)
    console.log("Balance", config.coin1.name, data.coin1Balance)
    console.log("Balance", "ETH", data.ethBalance)

    document.getElementById("coin0-name").innerText = config.coin0.name
    document.getElementById("coin0").innerText = data.coin0Balance
    document.getElementById("coin1-name").innerText = config.coin1.name
    document.getElementById("coin1").innerText = data.coin1Balance
    document.getElementById("eth").innerText = data.ethBalance
}

function showPosition(config, data) {
    console.log("Position", data.position, data.position.liquidity.toString())

    document.getElementById("position-number").innerText = data.position.id

    if (data.position.liquidity.toString() === "0") {
        console.log("Position closed")
        document.getElementById("position-status").innerText = "Закрыта"
        return
    }

    const priceUpper = uniswap.getPriceFromTick(config, data.position.tickUpper)
    const priceLower = uniswap.getPriceFromTick(config, data.position.tickLower)

    const isInRange = data.priceCurrent > priceLower && data.priceCurrent < priceUpper
    const isUpper = !isInRange && data.priceCurrent > priceUpper

    // View

    document.getElementById("position-status").innerHTML = isInRange ? html.textGreen("Открыта") : html.textRed("Закрыта")

    let priceHtml = ""
    if (isInRange) {
        priceHtml = `${html.textGray(html.price(priceLower))} &mdash; ${html.textGreen(html.price(data.priceCurrent))} &mdash; ${html.textGray(html.price(priceUpper))}`
    } else if (isUpper) {
        priceHtml = `${html.textGray(html.price(priceLower))} &mdash; ${html.textGray(html.price(priceUpper))} &mdash; ${html.textRed(html.price(data.priceCurrent))}`
    } else {
        priceHtml = `${html.textRed(html.price(data.priceCurrent))} &mdash; ${html.textGray(html.price(priceLower))} &mdash; ${html.textGray(html.price(priceUpper))}`
    }

    document.getElementById("position-price").innerHTML = priceHtml
}

window.uniswapAppMain()