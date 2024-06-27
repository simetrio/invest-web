const { ethers } = require("ethers")
const { uniswap } = require("./libs/uniswap")
const { coins } = require("./libs/coins")

window.uniswapAppMain = async function() {
    if (!location.hash) {
        console.log("Укажите адрес кошелька")
        return
    }

    const walletAddress = location.hash.replace("#", "")
    console.log(walletAddress)

    const config = {
        wallet: {
            address: walletAddress,
        },
        provider: new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
    }

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

window.uniswapAppMain()