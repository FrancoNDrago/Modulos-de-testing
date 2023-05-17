import { __dirname } from "../utils.js";
import { CartsFty } from "../daos/factory.js";

class CartService{
    constructor(){
        this.persistanceEngine = new CartsFty();
    }

    getCart(id, populated=true){
        return this.persistanceEngine.getCartById(id, populated);
    }

    addCart(cart){
        return this.persistanceEngine.addCart(cart);
    }

    addProductToCart(cartId, productId){
        return this.persistanceEngine.addProductToCart(cartId, productId);
    }

    updateCart(id, products){
        return this.persistanceEngine.updateCart(id, products);
    }

    updateProdQty(cartId, productId, qty){
        return this.persistanceEngine.updateProductInCart(cartId, productId, qty);
    }

    deleteProduct(cartId, productId){
        return this.persistanceEngine.deleteProductFromCart(cartId, productId);
    }

    deleteAllProducts(cartId){
        return this.persistanceEngine.deleteAllProductFromCart(cartId);
    }
}

export default CartService;