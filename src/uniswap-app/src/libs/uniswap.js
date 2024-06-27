const { ethers, } = require("ethers");
const { coins } = require("./coins");

async function getBalance(config, token) {
    const contract = new ethers.Contract(token.address, ERC20_ABI, config.provider);
    const balance = await contract.balanceOf(config.wallet.address);
    return token.fromBigNumber(balance);
}

async function getEthBalance(config) {
    const balance = await config.provider.getBalance(config.wallet.address);
    return coins.WETH.fromBigNumber(balance);
}

const ERC20_ABI = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",
    'function approve(address _spender, uint256 _value) returns (bool)',

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)",
]

module.exports.uniswap = {
    getBalance,
    getEthBalance,
}