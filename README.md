# Coupon
[![NPM](https://nodei.co/npm/coupon.png)](https://nodei.co/npm/coupon/)

Coupon — discount coupons generator. Coupon is designed to be the simplest way possible to create a discount coupons for e-commerce purposes.

## Installation

    npm install coupon

## Usage:
```js
var coupon = require("coupon");
var myCoupon = coupon("GREAT-30")
	.give("30%")
	.limit(10)
	.person("Mr. Fetus")
	.only("Banana")
	.expire(new Date(2015, 0, 1));
console.log(myCoupon.json());
```

## Examples:
### 5% discount coupon for anyone
```js
var coupon = require("coupon");
var myCoupon = coupon("HELLO-5").give("5%");
console.log(myCoupon.json());
```
```js
{
	id: 'W0YEPW913C8M279D0ECV2P5P0C11QAV1',
	name: 'HELLO-5',
	discount: 0.05		
}
```
### 20% one-time discount coupon for John
```js
var coupon = require("coupon");
var myCoupon = coupon("HELLO-JOHN").give("20%").person("John").limit(1);
console.log(myCoupon.json());
```
```js
{
	id: 'K5PL08XU1GG71T9VW00Y4CEUJFVPMM2F',
	name: 'HELLO-JOHN',
	user: 'John',
	countMax: 1,
	discount: 0.2 
}
```

## API

### give()
Specifies amount of discount.
```js
coupon().give(10);
```
or
```js
coupon().give("10%");
```
You can pass "free" string
```js
coupon().give("free").only("Delivery");
```
### person()
Specifies user
```js
coupon().give("5%").person("John Smith");
```
### limit()
Specifies how many times you can use coupon
```js
coupon().give("5%");
```
### expire()
Specifies expiration date of coupon
```js
coupon().give("10%").expire(new Date(2015, 5, 15));
```
### only()
Specifies the service
```js
coupon().give("5%").only("Banana");
```
### json()
Generate JSON object
```js
coupon().give("5%");
```
## Test

	npm test

## License

Licensed under the [MIT license](http://creativecommons.org/licenses/MIT/)

Copyright &copy; 2014 Roman Timashev <roman@tmshv.ru> (http://roman.tmshv.ru)