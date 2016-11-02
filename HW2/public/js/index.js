$(document).ready(function(){
    let socket = io('http://localhost:3000');
    
    
    socket.on("productAdded", function(data){
        let basket=$('.basket-items'),
            products=data.basket.productLineItems;
        basket.html('');
        $('.js_place-order').removeClass('hide');
        for(let i in products)
        {
            let product=products[i];
            basket.append('<div id="'+i+'" class="basket-item">'+product.product.name+': <span class="total">'+product.total+'</span> <div class="action"><input type="number" min="1"  max="100" value="'+product.qty+'"><button class="delete">X</button></div><div style="clear:both"></div></div>');
        }
        basket.append('<hr>');
        basket.append('Total: <span class="total_t">'+data.total+'</span>');
    }).on('productEdited',function(data){
        $('.basket-item#'+data.pid).find('span.total').text(data.item.total);
        $('span.total_t').text(data.total);
    });
    
    
    $(".js_add-to-cart").on("click", function(){
	   socket.emit("addProduct", {
		pid : $(this).data("productId")
        });
	});
    $('body').on('change','.basket-item input',function(e){
       socket.emit("editProduct",{
           pid:$(this).parents('.basket-item').attr('id'),
           count:parseInt($(this).val())
       })
    }).on('click','.basket-item button.delete',function(){
        socket.emit("deleteProduct",{
           pid:$(this).parents('.basket-item').attr('id'),
        })
    }).on('click','.basket-container button.js_place-order',function(e){
        socket.emit('order');
        $('.basket-items').html('');
        $('.js_place-order').addClass('hide');
    })


})

