import CartService from "../services/carts.service.js";
import ProductService from "../services/products.service.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { isProductOwner } from "../services/errors/info/carts.error.info.js";

class CartController{
    constructor(){
        this.cartService = new CartService();
        this.productService = new ProductService();
    }

    getCart(id, populated=true){
        return this.cartService.getCart(id, populated);
    }

    addCart(cart){
        return this.cartService.addCart(cart);
    }

    async addProductToCart(cartId, productId, user){
        let product = await this.productService.getProduct(productId);

        if(user.rol.toUpperCase() === "PREMIUM" && String(user._id) === String(product.owner))
            CustomError.createError({
                name: "Propietario del producto",
                cause: isProductOwner(String(user._id), String(product._id)),
                message: `El usuario no puede agregar al carrito productos de los que sea propietario`,
                code: EErrors.CARTS.IS_PRODUCT_OWNER
            });

        return this.cartService.addProductToCart(cartId, productId);
    }

    updateCart(id, products){
        return this.cartService.updateCart(id, products);
    }

    updateProdQty(cartId, productId, qty){
        return this.cartService.updateProdQty(cartId, productId, qty);
    }

    deleteProduct(cartId, productId){
        return this.cartService.deleteProduct(cartId, productId);
    }

    deleteAllProducts(cartId){
        return this.cartService.deleteAllProducts(cartId);
    }
}

export default CartController;