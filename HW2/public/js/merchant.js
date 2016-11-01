$(document).ready(function(){
    let socket = io('http://localhost:3000/merchant');
    socket.on('addProduct',function(data){
        let html='<div data-product-id="'+data.pid+'" class="product-container border"><span>Name:</span><div><input value="'+data.product.name+'" name="product_name" type="text"/></div><div><span>Price:</span><input value="'+data.product.price+'" name="product_price" type="text"/></div><div><span>inventory:</span><input value="'+data.product.inventory+'" name="product_inventory" type="text"/></div><div class="product-buttons"><button class="update">Update</button><button class="remove">Remove</button></div></div>';
        $('.left .products').append(html);
    }).on('order_merch',function(data){
        console.log(data);
        let html='';
		$('.orders-items').html('');
        for(let i in data.orders)
        {
            let item=data.orders[i],
                sum=0;
            for(let j in item.productLineItems)
            {
                sum+=item.productLineItems[j].total;
            }
            html='';
            html+='<div class="order" data-order-id="'+i+'">';
            html+='<strong>Client: '+item.client+'</strong>';
            html+='<br>';
            html+='<span>';
            html+='<span>Total price:</span>';
            html+='<span>'+sum+'</span>';
            html+='</span>';
            html+='<div class="action">'
            html+='<select name="" id="">'
            html+='<option '+(item.status=="placed"?"selected":null)+' value="placed">placed</option>'
            html+='<option '+(item.status=="delivered"?"selected":null)+'  value="delivered">delivered</option>'
            html+='<option '+(item.status=="cancelled"?"selected":null)+'  value="cancelled">cancelled</option>'
            html+='</select>'
            html+='</div>'
            html+='<div style="clear:both"></div>';
            html+='<ul>';
            for(let j in item.productLineItems)
            {
                html+='<li>';
                html+=item.productLineItems[j].product.name;
                html+='('+item.productLineItems[j].qty+'):';
                html+=item.productLineItems[j].total;
                html+='</li>';
            }
            html+='</ul>';
            html+='</div>';

            $('.orders-items').append(html);
        }
    });
    $('.products').on('click','.product-container button.update',function(e){
        let parent=$(this).parents('.product-container'),
            name=parent.find('input[name="product_name"]').val(),
            price=parent.find('input[name="product_price"]').val(),
            inventory=parent.find('input[name="product_inventory"]').val(),
            pid=parent.data('product-id');
        socket.emit('editProduct',{
            name:name,
            price:price,
            inventory:inventory,
            pid:pid
        });
    })
    $('.products').on('click','.product-container button.remove',function(e){
        $(this).parents('.product-container').remove();
        socket.emit('deleteProduct',{
            pid:$(this).parents('.product-container').data('product-id')
        })
    })
    $('.new-product-container').on('click','button.add',function(e){
        let parent=$(this).parents('.new-product-container'),
            name=parent.find('input[name="product_new_name"]'),
            price=parent.find('input[name="product_new_price"]');
            inventory=parent.find('input[name="product_new_inventory"]');
        socket.emit('addProduct',{
            name:name.val(),
            price:price.val(),
            inventory:inventory.val(),
        });
        name.val('');
        price.val('');
        inventory.val('');
        name.focus();
    });
    $('.order-container').on('change','.order .action select',function(e){
        socket.emit('changeStatus',{
            pid:$(this).parents('.order').data('order-id'),
            status:$(this).val()
        })
    })
    
})

