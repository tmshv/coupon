function parseDiscount(date){
    if(/\d+%?/.test(date)) return parseFloat(/(\d+)/.exec(date)[1]);
    if(/free/.test(date)) return "free";
    return null;
}

module.exports = parseDiscount;