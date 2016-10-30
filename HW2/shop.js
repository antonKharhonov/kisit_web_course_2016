"use strict"
var products = [
        {
            name : "Ballantine's ",
            price : 999,
            inventory : 20
        },
        {
            name : "Bell's Original",
            price : 199,
            inventory : 80
        },
        {
            name : "Black Jack Silver",
            price : 94,
            inventory : 80
        },
    ],
   orders = [];


class ProductLineItem {
	constructor(productID){
		this.product = products[productID];
		this.qty = 1;
		this.total = this.product.price;
	}
	updateQty(qty) {
		this.qty = qty;
		this.total = this.product.price * qty;
	}
}

class ProductlineItemContainer {
	constructor(){
		this.productLineItems = [];
	}
	getTotalPrice(){
		var sum = 0;
		for(let i = 0; i < this.productLineItems.length; i ++) {
			sum += this.productLineItems[i].total;
		}
		return sum;
	}
}

class Order extends ProductlineItemContainer {
	constructor(basket,client) {
        super();
        this.client=client;
		this.productLineItems = basket.productLineItems;
        this.status="placed";
	}
	setStatus(status) {
		this.status = status;
	}
}

Order.STATUS_PLACED = "placed";
Order.STATUS_DELIVERED = "delivered";
Order.STATUS_CANCELED = "cancelled";

class Basket extends ProductlineItemContainer {
	addProduct(productID){
		this.productLineItems.push(new ProductLineItem(productID))
		return this;
	}
	removeProduct(productID){
        this.productLineItems.splice(productID,1);
        return this;
	}
	updateProductQuantity(productID, qty) {
		for(let i = 0; i < this.productLineItems; i++) {
			if(this.productLineItems[i].product.id == productID) {
                console.log(qty);
				this.productLineItems[i].updateQty(qty);
			}
		}
	}
	has(id)
    {
        let items=this.productLineItems;
        for(let i in items)
        {
            if(products[id]==items[i].product)return true;
        }
        return false;
    }
    find(id)
    {
        let items=this.productLineItems;
        for(let i in items)
        {
            if(items[i].product==products[id])return items[i];
        }
        return null;
    }
	placeOrder(client) {
		var order = new Order(this,client);
		orders.push(order);
		return order;
	}
}

module.exports = {
	Basket : Basket,
	products : products,
	orders : orders
}
