function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.round = function (value, digits) {
    const multiplier = Math.pow(10, digits)
    return Math.round(value * multiplier) / multiplier
}

module.exports.roundPrice = function (value) {
    return module.exports.round(value, 2)
}