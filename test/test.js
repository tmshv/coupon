var should = require("should");
var coupon = require("../");
var Coupon = require("../lib/coupon");

describe("coupon", function () {
    it("should return instance of `Coupon`", function () {
        coupon().should.be.instanceof(Coupon);
    });

    it("should have Coupon", function () {
        coupon.should.have.property("Coupon", Coupon);
    });
});
