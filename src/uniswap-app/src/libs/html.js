function textGreen(text) {
    return `<span class="text-success">${text}</span>`
}

function textRed(text) {
    return `<span class="text-danger">${text}</span>`
}

function textGray(text) {
    return `<span class="text-secondary">${text}</span>`
}

function price(text) {
    return `${text} $`
}

module.exports.html = {
    textGreen,
    textRed,
    textGray,
    price,
}