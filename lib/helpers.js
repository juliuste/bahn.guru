'use strict'

const formatPrice = (price) => {
	price = price.toFixed(2).toString().split('.') 
	return {euros: price[0], cents: price[1]}
}

module.exports = {formatPrice}