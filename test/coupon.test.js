var should = require("should");
var _ = require("underscore");
var Coupon = require("../lib/coupon");

describe("Coupon", function () {
    describe("static", function () {
        describe("create()", function () {
            it("should return instance of `Coupon`", function () {
                Coupon.create().should.be.instanceof(Coupon);
            });

            it("should create unlimited public coupon that do nothing if no parameters passed", function () {
                var inst = Coupon.create();
                inst.isPublic().should.be.true;
                inst.isUnlimited().should.be.true;
                inst.discount.should.be.equal(0);
                should.not.exist(inst.service);
            });

            it("should accept String meaning name of Coupon", function () {
                Coupon.create("HELLO").name.should.be.equal("HELLO");
            });

            it("should accept Object meaning serialized instance of Coupon", function () {
                var json = {
                    "id": "asdfqwer",
                    "name": "HELLO",
                    "discount": 0.1,
                    "count": 1,
                    "countMax": 10,
                    "expirationDate": new Date(),
                    "user": "Steve Jobs",
                    "service": "Banana"
                };
                var coupon = Coupon.create(json);
                coupon.name.should.be.equal("HELLO");
                coupon.id.should.be.equal("asdfqwer");
                coupon.count.should.be.equal(1);
                coupon.countMax.should.be.equal(10);
                coupon.discount.should.be.equal(0.1);
            });

            it("should preprocess discount field", function () {
                var json = {
                    "discount": "2%"
                };
                var coupon = Coupon.create(json);
                coupon.discount.should.be.equal(0.02);
            });
        });
    });

    describe("property", function () {
        describe("id", function () {
            it("should be unique", function () {
                var list = [];
                for (var i = 0; i < 5000; i++) {
                    list.push(Coupon.create().id);
                }

                _.uniq(list).length.should.be.equal(list.length);
            });

            it("should be getter only", function () {
                var inst = Coupon.create();
                var old = inst.id;
                inst.id = "HELLO-LOL";
                inst.id.should.be.equal(old);
            });

            it("should be enumerable", function () {
                var inst = Coupon.create();
                var clone = {};
                for(var i in inst) {
                    clone[i] = inst;
                }

                clone.should.have.property("id");
            });
        });

        describe("name", function () {

        });

        describe("discount", function () {

        });

        describe("count", function () {
            it("should be getter only", function () {
                var inst = Coupon.create();
                inst.count = 10;
                inst.count.should.be.equal(0);
            });
        });

        describe("countMax", function () {

        });

        describe("expirateionDate", function () {

        });

        describe("user", function () {

        });
    });

    describe("limit()", function () {
        it("should return instance of `Coupon`", function () {
            Coupon.create().limit(10).should.be.instanceof(Coupon);
        });

        it("should invalidate limitation by count if no parameters passed", function () {
            Coupon.create().limit(10).limit().countMax.should.be.equal(0);
        });

        it("should invalidate limitation by count if `null` passed", function () {
            Coupon.create().limit(10).limit(null).countMax.should.be.equal(0);
        });

        it("should invalidate limitation by count if `undefined` passed", function () {
            Coupon.create().limit(10).limit(undefined).countMax.should.be.equal(0);
        });

        it("should invalidate limitation by count if `false` passed", function () {
            Coupon.create().limit(10).limit(false).countMax.should.be.equal(0);
        });

        it("should overwrite previous limit", function () {
            Coupon.create()
                .limit(3)
                .limit(5).countMax.should.be.equal(5);
        });

        it("should limit by count if Number passed", function () {
            Coupon.create().limit(101).countMax.should.be.equal(101);
        });
    });

    describe("person()", function () {
        it("should return self instance", function () {
            var inst = Coupon.create();
            inst.person().should.be.equal(inst);
        });

        it("should invalidate limitation by user if no parameters passed", function () {
            should.not.exist(Coupon.create().person("Steve Jobs").person().user);
        });

        it("should invalidate limitation by user if `null` passed", function () {
            should.not.exist(Coupon.create().person("Steve Jobs").person(null).user);
        });

        it("should invalidate limitation by user if `undefined` passed", function () {
            should.not.exist(Coupon.create().person("Steve Jobs").person(undefined).user);
        });

        it("should invalidate limitation by user if `false` passed", function () {
            should.not.exist(Coupon.create().person("Steve Jobs").person(false).user);
        });

        it("should overwrite previous user", function () {
            Coupon.create()
                .person("Steve Jobs")
                .person("Tim Cook").user.should.be.equal("Tim Cook");
        });

        it("should accept String meaning user name to limit", function () {
            Coupon.create().person("Steve Jobs").user.should.be.equal("Steve Jobs");
        });
    });

    describe("expire()", function () {
        it("should return self instance", function () {
            var inst = Coupon.create();
            inst.expire().should.be.equal(inst);
        });

        it("should invalidate limitation by expiration date if no parameters passed", function () {
            should.not.exist(Coupon.create().expire(new Date(2000, 1, 2)).expire().expirationDate);
        });

        it("should invalidate limitation by expiration date if `null` passed", function () {
            should.not.exist(Coupon.create().expire(new Date(2000, 1, 2)).expire(null).expirationDate);
        });

        it("should invalidate limitation by expiration date if `undefined` passed", function () {
            should.not.exist(Coupon.create().expire(new Date(2000, 1, 2)).expire(undefined).expirationDate);
        });

        it("should invalidate limitation by expiration date if `false` passed", function () {
            should.not.exist(Coupon.create().expire(new Date(2000, 1, 2)).expire(false).expirationDate);
        });

        it("should overwrite previous expiration date", function () {
            Coupon.create()
                .expire(new Date(2000, 1, 2))
                .expire(new Date(2015, 11, 31))
                .expirationDate.getTime().should.be.equal(new Date(2015, 11, 31).getTime());
        });

        it("should accept Date meaning limitation by expiration date", function () {
            var exp = new Date(2001, 8, 9);
            Coupon.create().expire(exp).expirationDate.should.be.instanceof(Date);
            Coupon.create().expire(exp).expirationDate.getTime().should.be.equal(exp.getTime());
        });

        it("should accept Number meaning milliseconds period of Coupon", function () {
            var exp = new Date();
            exp.setTime(exp.getTime() + 100000);
            Coupon.create().expire(100000).expirationDate.should.be.instanceof(Date);
            var c = Coupon.create().expire(100000).expirationDate.getTime();
            (c - exp.getTime()).should.be.lessThan(1000);
        });
    });

    describe("only()", function () {
        it("should return self instance", function () {
            var inst = Coupon.create();
            inst.only().should.be.equal(inst);
        });

        it("should invalidate limitation by service if no parameters passed", function () {
            should.not.exist(Coupon.create().only("Banana").only().service);
        });

        it("should invalidate limitation by service if `null` passed", function () {
            should.not.exist(Coupon.create().only("Banana").only(null).service);
        });

        it("should invalidate limitation by service if `undefined` passed", function () {
            should.not.exist(Coupon.create().only("Banana").only(undefined).service);
        });

        it("should invalidate limitation by service if `false` passed", function () {
            should.not.exist(Coupon.create().only("Banana").only(false).service);
        });

        it("should accept String meaning service to limit", function () {
            Coupon.create().only("Banana").service.should.be.equal("Banana");
        });

        it("should accept Array meaning scope of services to limit", function () {
            Coupon.create().only(["classic", "piano", "orchestra"]).service.join(" ").should.be.equal("classic piano orchestra");
        });

        it("should overrite previous service", function () {
            Coupon.create().only("Apple").only("Banana").service.should.be.equal("Banana");
        });
    });

    describe("give()", function () {
        it("should return self instance", function () {
            var inst = Coupon.create();
            inst.give().should.be.equal(inst);
        });

        it("should accept Number meaning percent", function () {
            Coupon.create().give(10).discount.should.be.equal(0.1);
            for (var i = 0; i < 100; i++) {
                var d = Math.random() * 100;
                Coupon.create().give(d).discount.should.be.equal(d / 100);
            }
        });

        it("should accept String `X%` meaning percent", function () {
            Coupon.create().give("10%").discount.should.be.equal(0.1);
            for (var i = 0; i < 100; i++) {
                var d = Math.round(Math.random() * 100);
                Coupon.create().give(d + "%").discount.should.be.equal(d / 100);
            }
        });

        it("should accept String `X` meaning percent", function () {
            Coupon.create().give("10").discount.should.be.equal(0.1);
        });

        it("should accept String `free` meaning free", function () {
            Coupon.create().give("free").discount.should.be.equal("free");
        });

        it("should overwrite previous give() calls", function () {
            Coupon.create().give("10%").give("20%").discount.should.be.equal(0.2);
        });

        it("should invalidate discount if no parameters passed", function () {
            Coupon.create().give("10%").give().discount.should.be.equal(0);
        });

        it("should invalidate discount if `null` passed", function () {
            Coupon.create().give("10%").give(null).discount.should.be.equal(0);
        });

        it("should invalidate discount if `undefined` passed", function () {
            Coupon.create().give("10%").give(undefined).discount.should.be.equal(0);
        });

        it("should invalidate discount if `false` passed", function () {
            Coupon.create().give("10%").give(false).discount.should.be.equal(0);
        });
    });

    describe("apply()", function () {
        it("should return self instance", function () {
            var inst = Coupon.create();
            inst.apply().should.be.equal(inst);
        });

        it("should increase count by 1", function () {
            Coupon.create()
                .apply()
                .apply()
                .apply()
                .apply()
                .apply()
                .count.should.be.equal(5);
        });

        it("should throw an Error if max count reached", function (done) {
            this.timeout(100);

            try {
                Coupon.create()
                    .limit(3)
                    .apply()
                    .apply()
                    .apply()
                    .apply();
            } catch (error) {
                error.message.should.be.equal("cannot apply voided coupon");
                done();
            }
        });
    });

    describe("invalidate()", function () {
        it("should return self instance", function () {
            var inst = Coupon.create();
            inst.invalidate().should.be.equal(inst);
        });

        it("should make coupon voided", function () {
            Coupon.create().invalidate().isVoided().should.be.true;
        });
    });

    describe("json()", function () {
        it("should have property `id`", function () {
            Coupon.create().json().should.have.property("id");
        });

        it("should have property `name`", function () {
            Coupon.create("HELLO").json().should.have.property("name", "HELLO");
        });

        it("should have property `user` if its specified", function () {
            Coupon.create().person("Steve Jobs").json().should.have.property("user", "Steve Jobs");
        });

        it("should not have property `user` if its not specified", function () {
            Coupon.create().json().should.not.have.property("user");
        });

        it("should have property `countMax` if its specified", function () {
            Coupon.create().limit(3).json().should.have.property("countMax", 3);
        });

        it("should not have property `countMax` if its not specified", function () {
            Coupon.create().json().should.not.have.property("countMax");
        });

        it("should have property `expirationDate` if its specified", function () {
            var coupon = Coupon.create().expire(1000);
            coupon.json().should.have.property("expirationDate");
            (new Date(coupon.json().expirationDate).getTime()).should.be.equal(coupon.expirationDate.getTime());
        });

        it("should not have property `expirationDate` if its not specified", function () {
            Coupon.create().json().should.not.have.property("expirationDate");
        });

        it("should have property `service` if its specified", function () {
            Coupon.create().only("Banana").json().should.have.property("service", "Banana");
        });

        it("should not have property `service` if its not specified", function () {
            Coupon.create().json().should.not.have.property("service");
        });

        it("should have property `discount` anyway", function () {
            Coupon.create().give(50).json().should.have.property("discount", 0.5);
            Coupon.create().json().should.have.property("discount", 0);
        });
    });

    describe("profit()", function () {
        it("should return a Number", function () {
            Coupon.create().profit().should.be.instanceof(Number);
        });

        it("should be zero for non-configured coupon", function () {
            Coupon.create().profit().should.be.equal(0);
        });

        it("should accept Number", function () {
            Coupon.create().give(20).profit(150).should.be.equal(150 * 0.2);
        });
    });

    describe("isPublic()", function () {
        it("coupon should be public if in's not configured", function () {
            Coupon.create().isPublic().should.be.true;
        });
    });

    describe("isUnlimited()", function () {
        it("coupon should be unlimited if `expirationDate` and `countMax` not specified", function () {
            Coupon.create().isUnlimited().should.be.true;
        });

        it("coupon should be limited if `expirationDate` specified", function () {
            Coupon.create().expire(Date.now()).isUnlimited().should.be.false;
        });

        it("coupon should be limited if `countMax` specified", function () {
            Coupon.create().limit(111).isUnlimited().should.be.false;
        });
    });

    describe("isExpired()", function () {
        it("coupon should be not expired if `expirationDate` is not specified", function () {
            Coupon.create().isExpired().should.be.false;
        });

        it("coupon should be expired if `expirationDate` is late", function () {
            Coupon.create().expire(new Date(2001, 8, 9)).isExpired().should.be.true;
        });

        it("coupon should be expired if its voided", function () {
            Coupon.create().invalidate().isExpired().should.be.true;
        });
    });

    describe("isVoided()", function () {
        it("coupon should be voided if count max reached", function () {
            Coupon.create().limit(2).apply().apply().isVoided().should.be.true;
        });
    });
});