const Cart = require('../modals/cart')


exports.addItemToCart = async (req,res) =>{

    // res.json({message: 'cart'})

    try {
        const cart = await Cart.findOne({user: req.user._id}) 
        console.log("find the cart with the user");
        if(cart)
        {   
            console.log(cart);
            // if cart already exists then update cart by quantity
            console.log("If cart against a user exists then find the the cart Items and update it.");

            const product = req.body.cartItems.product;

            const item = await cart.cartItems.find(c => c.product == product);
            
            let condition, action;

            if(item){

                condition = {"user": req.user._id, "cartItems.product": product};

                action = {
                    "$set": {
                        "cartItems.$": {            // Once we have selected a product in cart items. To update that product only we use cartItems.$; If we used cartItems only & multiple products were pushed in cart. Then, if we would update quantity of any particular product item. It would do so but all the other product items would be lost too.  
                            ...req.body.cartItems,
                            quantity: item.quantity + req.body.cartItems.quantity 
                        }
                    }

                };

                
            }
            else
            {

                condition = {user:req.user._id};

                action = {
                    "$push": {
                        "cartItems": req.body.cartItems
                    }

                }

                console.log("If cart Item does not exist then create the cart item");
                
            }

            Cart.findOneAndUpdate(condition, action)
            .then((_cart)=> {
                return res.status(201).json({ cart: _cart})
            })
            .catch((error) => {
                return res.status(400).json({error})
            })
            
            
        }    
        else
        {
            // else create a new cart 
            console.log("create a new cart if cart does not exist against a user")
            const new_cart = new Cart({
                user: req.user._id,
                cartItems: [req.body.cartItems]
            })
        
            const c = await new_cart.save()
    
            
            return res.status(200).json({c})

        }

    } 
    catch (error) {
        console.log("The error => ",error);
        return res.status(400).json({message: "Error Found",error})
    }
    


}