var Coupon = require("./lib/coupon");

var make = function(){
    return Coupon.create.apply(undefined, arguments);
}
make.Coupon = Coupon;
module.exports = make;