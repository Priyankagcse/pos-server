function isNullOrUndefinedOrEmpty(value) {
    return value === undefined || value === null || value === '';
}

module.exports = { isNullOrUndefinedOrEmpty };