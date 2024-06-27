const { ethers, } = require("ethers");
const { coins } = require("./coins");
const INONFUNGIBLE_POSITION_MANAGER = require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json")
const JSBI = require("jsbi")

async function getBalance(config, token) {
    const contract = new ethers.Contract(token.address, ERC20_ABI, config.provider);
    const balance = await contract.balanceOf(config.wallet.address);
    return token.fromBigNumber(balance);
}

async function getEthBalance(config) {
    const balance = await config.provider.getBalance(config.wallet.address);
    return coins.WETH.fromBigNumber(balance);
}

async function getLastPosition(config) {
    const nfpmContract = new ethers.Contract(
        config.NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        INONFUNGIBLE_POSITION_MANAGER.abi,
        config.provider
    )

    const numPositions = await nfpmContract.balanceOf(config.wallet.address)

    const positionId = await nfpmContract.tokenOfOwnerByIndex(config.wallet.address, numPositions - 1)
    const position = await nfpmContract.positions(positionId)

    return formatPosition(position, positionId)
}

function formatPosition(position, positionId) {
    return {
        id: positionId,
        position,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: JSBI.BigInt(position.liquidity),
        feeGrowthInside0LastX128: JSBI.BigInt(position.feeGrowthInside0LastX128),
        feeGrowthInside1LastX128: JSBI.BigInt(position.feeGrowthInside1LastX128),
        tokensOwed0: JSBI.BigInt(position.tokensOwed0),
        tokensOwed1: JSBI.BigInt(position.tokensOwed1),
    }
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
    getLastPosition,
}