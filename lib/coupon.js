var cc = require("coupon-code");
var parseDiscount = require("./parse-discount");

function Coupon(param){
    if(!param) param = {};
    if(!this instanceof Coupon) return Coupon.create({});
    var voided = false;

    var count = param["count"] || 0;
    Object.defineProperty(this, "count", {
        get: function(){
            return count;
        }
    });

    var id = param["id"] || cc.generate({parts: 1, partLen: 32});
    Object.defineProperty(this, "id", {
        enumerable: true,
        get: function(){
            return id;
        }
    });

    this.name = cc.generate({parts: 3, partLen: 2});
    this.user = undefined;
    this.expirationDate = undefined;
    this.service = undefined;
    this.discount = 0;
    this.countMax = Infinity;

    if(param instanceof Object){
        for(var i in param){
            if(i in handlers) {
                handler(this, i)(param[i]);
            }else{
                this[i] = param[i];
            }
        }
    }

    this.isPublic = function () {
        return !this.user;
    };

    this.isUnlimited = function () {
        var no_exp = this.expirationDate == null;
        var no_lim = this.countMax == Infinity;
        return no_exp && no_lim;
    };

    this.isExpired = function () {
        if (voided) return true;
        if (!this.expirationDate) return false;
        return this.expirationDate.getTime() < Date.now();
    };

    this.isVoided = function () {
        return voided;
    };

    this.invalidate = function () {
        voided = true;
        return this;
    };

    this.apply = function(){
        if(this.countMax == Infinity){
            count ++;
        }else{
            if(count < this.countMax){
                count ++;
                if(count <= this.countMax) this.invalidate();
            }else{
                throw new Error("cannot apply voided coupon");
            }
        }

        return this;
    }
}

/**
 * Creates an instance of Coupon
 * @param param
 * @returns {Coupon}
 */
Coupon.create = function (param){
    var coupon = new Coupon();
    if(param && typeof param == "string"){
        // coupon = new Coupon();
        coupon.name = param;
    }else if(param instanceof Object){
        coupon = new Coupon(param);
        // for(var i in param){
        //     coupon[i] = param[i];
        // }
    }
    return coupon;
};

Coupon.prototype.limit = function(param){
    if(!param){
        this.countMax = 0;
    }else if(typeof param == "number"){
        this.countMax = Math.floor(param);
    }

    return this;
};

Coupon.prototype.person = function(name){
    if(!name) {
        this.user = undefined;
    }else if(typeof name == "string"){
        this.user = name;
    }

    return this;
};

Coupon.prototype.only = function(sevice){
    if(!sevice) {
        this.service = undefined;
    }else if(typeof sevice == "string"){
        this.service = sevice;
    }else if(sevice instanceof Array){
        this.service = sevice;
    }

    return this;
};

Coupon.prototype.expire = function(date){
    if(!date) {
        this.expirationDate = undefined;
    }else if(date instanceof Date){
        this.expirationDate = date;
    }else if(typeof date == "number"){
        this.expire(new Date(date));
    }
    return this;
};

Coupon.prototype.give = function(discount){
    if(!discount) {
        this.discount = 0;
    }else if(typeof discount == "number"){
        this.discount = Math.abs(discount) / 100;
    }else if(typeof discount == "string"){
        discount = parseDiscount(discount);
        if(discount == "free") this.discount = "free";
        else this.give(discount);
    }
    return this;
};

Coupon.prototype.json = function(){
    var out = {};
    out.id = this.id;
    if(this.name) out.name = this.name;
    if(this.user) out.user = this.user;
    if(this.count) out.count = this.count;
    if(this.countMax != Infinity) out.countMax= this.countMax;
    if(this.service) out.service = this.service;
    if(this.expirationDate) out.expirationDate = this.expirationDate;
    out.discount = this.discount || 0;
    return out;
};

Coupon.prototype.profit = function(param){
    if(typeof  param == "number"){
        return calculateDiscount(param, this.discount);
    }else{
        return 0;
    }
};

var handlers = {
    //"discount": "give"
    "discount": function(target){
        return function(value){
            if(typeof value === "number"){
                value *= 100;
            }

            target.give(value);
        }
    }
};

function handler(target, param){
    if(param in handlers) {
        var h = handlers[param];
        if(typeof h === "string"){
            return target[h];
        }else if(typeof h === "function"){
            return h(target);
        }
    }
}

function calculateDiscount(price, discount){
    if(discount == "free") return price;
    else return discount * price;
}

module.exports = Coupon;