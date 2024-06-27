const { ethers, } = require("ethers")
const { ChainId, Token, } = require("@uniswap/sdk-core")
const { round, roundPrice } = require("./utils")

const WETH = {
    name: "WETH",
    price: 3522,
    toBigNumber: x => ethers.utils.parseUnits(x.toString(), "ether"),
    fromBigNumber: x => parseFloat(ethers.utils.formatUnits(x.toString(), "ether")),
    getPrice: x => roundPrice(x * WETH.price),
    round: x => round(x, 5),
}

const USDC = {
    name: "USDC",
    price: 1,
    toBigNumber: x => ethers.utils.parseUnits(x.toString(), "mwei"),
    fromBigNumber: x => parseFloat(ethers.utils.formatUnits(x.toString(), "mwei")),
    getPrice: x => roundPrice(x * USDC.price),
    round: x => roundPrice(x),
}

const Arbitrum_WETH = {
    ...WETH,
    address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    token: new Token(ChainId.ARBITRUM_ONE, "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", 18),
}

const Arbitrum_USDC = {
    ...USDC,
    address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    token: new Token(ChainId.ARBITRUM_ONE, "0xaf88d065e77c8cc2239327c5edb3a432268e5831", 6),
}

module.exports.coins = {
    WETH,
    USDC,

    Arbitrum_WETH,
    Arbitrum_USDC,
}