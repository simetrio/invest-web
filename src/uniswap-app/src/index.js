const { ethers } = require("ethers")
const { uniswap } = require("./libs/uniswap")
const { coins } = require("./libs/coins")

window.uniswapAppMain = async function () {
    if (!location.hash) {
        console.log("Укажите адрес кошелька")
        return
    }

    const walletAddress = location.hash.replace("#", "")
    console.log(walletAddress)

    const config = {
        NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        wallet: {
            address: walletAddress,
        },
        provider: new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
    }

    await Promise.all([loadBalance(config), loadPosition(config)])
}

async function loadBalance(config) {
    const [usdcBalance, wethBalance, ethBalance] = await Promise.all([
        uniswap.getBalance(config, coins.Arbitrum_USDC),
        uniswap.getBalance(config, coins.Arbitrum_WETH),
        uniswap.getEthBalance(config),
    ])

    console.log("Balance", "USDC", usdcBalance)
    console.log("Balance", "WETH", wethBalance)
    console.log("Balance", "ETH", ethBalance)

    document.getElementById("usdc").innerText = `${usdcBalance} $`
    document.getElementById("weth").innerText = wethBalance
    document.getElementById("eth").innerText = ethBalance
}

async function loadPosition(config) {
    const position = await uniswap.getLastPosition(config)
    console.log("Position", position, position.liquidity.toString())

    document.getElementById("position-number").innerText = position.id

    if (position.liquidity.toString() === "0") {
        console.log("Position closed")
        document.getElementById("position-status").innerText = "Закрыта"
        return
    }

    document.getElementById("position-status").innerText = "Открыта"
}

window.uniswapAppMain()