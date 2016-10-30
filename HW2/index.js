"use strict"
var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	shop = require("./shop"),
	io = require("socket.io")(http),
    merchants=null;
	
app.use(express.static('public'));
app.set('view engine', 'ejs'); 

var merchantIO = io.of('/merchant');
app.get('/merchant', function (req, res) {
	res.render("merchant", {
		products : shop.products,
		orders : shop.orders
	});
}); 
//Customer
app.get('/', function (req, res) {
	res.render("index", {
		products : shop.products
	});
});
io.on('connection', function (socket) {
	var basket = new shop.Basket();
	socket.join("customers");
	socket.on("addProduct", function(data) {
        if(!basket.has(data.pid))basket.addProduct(data.pid);
        else basket.find(data.pid).updateQty(basket.find(data.pid).qty+1);
		socket.emit("productAdded", {
			succses : true,
			basket : basket,
            total:basket.getTotalPrice()
		});
	}).on('editProduct',function(data){
        basket.find(data.pid).updateQty(data.count);
        socket.emit("productEdited", {
            pid:data.pid,
			item : basket.find(data.pid),
            total:  basket.getTotalPrice()
		});
    }).on('deleteProduct',function(data){
        basket.removeProduct(data.pid);
    	socket.emit("productAdded", {
			succses : true,
			basket : basket,
            total:basket.getTotalPrice()
		});
    }).on('order',function(){
        basket.placeOrder(socket.id);
        basket=new shop.Basket();
        merchantIO.to('merchants').emit('order_merch',{
            orders:shop.orders
        });
    });
});


//Merchant


merchantIO.on("connection", function(socket) {
    socket.join('merchants');
    socket.on('editProduct',function(data){
        shop.products[data.pid].name=data.name;
        shop.products[data.pid].price=data.price;
        shop.products[data.pid].inventory=data.inventory;
        console.log(shop.products[data.pid]);
    }).on('deleteProduct',function(data){
        shop.products.splice(data.pid,1);
    }).on('addProduct',function(data){
        shop.products.push(data);
        socket.emit('addProduct',{
            pid:shop.products.length-1,
            product:shop.products[shop.products.length-1]
        });
    }).on('order_merch',function(data){
        console.log(data);
    }).on('changeStatus',function(data){
        shop.orders[data.pid].status=data.status;
        console.log(shop.orders);
    })
});

var server = http.listen(3000);
