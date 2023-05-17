import mongoose from "mongoose";
import CartDTO from "../dtos/response/cart.res.dto.js";
import cartModel from "./models/cart.model.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { invalidId } from "../services/errors/info/generic.error.info.js";
import { cartNotFound, productNotInCart } from "../services/errors/info/carts.error.info.js";

class CartDbDAO{

  constructor(){}

  async exists(cartId){
    if(!mongoose.Types.ObjectId.isValid(cartId))
      CustomError.createError({
        name: "ID de carrito no valido",
        cause: invalidId(cartId, 'ObjectId'),
        message: "El valor enviado no corresponde a un ID valido",
        code: EErrors.GENERICS.ID_TYPE_NOT_VALID
      });

    let exist = await cartModel.exists({_id:cartId});
    
    if(!!!exist)
      CustomError.createError({
        name: "No existe carrito",
        cause: cartNotFound(cartId),
        message: `No existe carrito con el ID ${cartId}.`,
        code: EErrors.CARTS.CART_NOT_FOUND
      });

    return true;
  }

  async hasProduct(cartId, productId){
    let cart = await this.getCartById(cartId);

    return cart.products.some(prod => prod.product._id == productId);
  }

  async getCarts(){
    return await cartModel.find();
  }

  async getCartById(id, populated=false){
    await this.exists(id);

    let cartDb = (populated) ? await cartModel.findById(id).populate("products.product").lean() : await cartModel.findById(id).lean();

    let cart = new CartDTO({
      id: cartDb._id,
      products: cartDb.products
    });

    return cart;
  }

  async addCart(cartToAdd){
    return cartModel.create(cartToAdd);
  }

  async updateCart(cartId, products){
    await this.exists(cartId);

    return cartModel.updateOne({_id:cartId}, {products});
  }

  async addProductToCart(cartId, productToAdd){
    await this.exists(cartId);

    let cart = await this.getCartById(cartId);

    let productExist = cart.products.find(prod => {
      return prod.product._id == productToAdd
    });

    if(!!productExist){
      let productIndex = cart.products.indexOf(productExist);

      cart.products[productIndex].quantity++;
    }else{
      cart.products.push({product: productToAdd, quantity:1})
    }

    return cartModel.updateOne({_id:cartId}, {products:cart.products});
  }
  
  async updateProductInCart(cartId, productToUpdate, qty){
    await this.exists(cartId);

    if(!await this.hasProduct(cartId, productToUpdate))
      CustomError.createError({
        name: "Producto no existe en carrito",
        cause: productNotInCart(productToUpdate, cartId),
        message: `No existe el producto ${productToUpdate} en el carrito ${cartId}`,
        code: EErrors.CARTS.PRODUCT_NOT_IN_CART
      });

    let cart = await this.getCartById(cartId);
    let product = cart.products.find(prod=>prod.product == productToUpdate);
    let productIndex = cart.products.indexOf(product);

    cart.products[productIndex].quantity = qty;

    return cartModel.updateOne({_id: cartId}, {products: cart.products})
  }

  async deleteProductFromCart(cartId, productToDelete){
    await this.exists(cartId);

    let cart = await this.getCartById(cartId);

    let productExist = cart.products.find(prod => prod.product._id == productToDelete);

    if(!!!productExist)
      CustomError.createError({
        name: "Producto no existe en el carrito",
        cause: productNotInCart(productToDelete, cartId),
        message: `No existe el producto ${productToDelete} en el carrito ${cartId}`,
        code: EErrors.CARTS.PRODUCT_NOT_IN_CART
      });
    
    let productIndex = cart.products.indexOf(productExist);

    cart.products.splice(productIndex, 1);

    return cartModel.updateOne({_id:cartId}, {products:cart.products});
  }

  async deleteAllProductFromCart(cartId){
    await this.exists(cartId);

    return cartModel.updateOne({_id:cartId}, {products:[]});
  }
}

export default CartDbDAO;