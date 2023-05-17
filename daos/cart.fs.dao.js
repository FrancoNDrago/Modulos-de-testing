import fs from "fs";
import { __dirname } from "../utils.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { invalidId } from "../services/errors/info/generic.error.info.js";
import { cartNotFound, cartAlreadyExist, productNotInCart } from "../services/errors/info/carts.error.info.js";

class CartFsDAO{

  constructor(){
    this.fs = fs.promises;
    this.path = __dirname+"/fs_persistance/carts.json";
    this.carts = [];
    this.cartsId = 0;
    
    if(!fs.existsSync(this.path)){
      fs.writeFileSync(this.path, "[]");
    }

    this.loadCarts();
  }

  async exist(cartId){
    if(isNaN(cartId))
      CustomError.createError({
        name: "ID de carrito no valido",
        cause: invalidId(cartId, "numeric"),
        message: `El ID no es valido. ID: ${cartId}.`,
        code: EErrors.GENERICS.ID_TYPE_NOT_VALID
      });
    let carts = await this.readCarts();
    let exist = carts.some(cart=>cart.cartId == Number(cartId));

    if(!!!exist)
      CustomError.createError({
        name: "No existe el carrito",
        cause: cartNotFound(cartId),
        message: `No existe carrito con el ID ${cartId}.`,
        code: EErrors.CARTS.CART_NOT_FOUND
      });

    return true;
  }

  async hasProduct(cartId, productId){

    let cart = await this.getCartById(cartId);

    return cart.products.some(product=>product.product == productId);
  }

  async getCarts(){
    return await this.readCarts();
  }

  async getCartById(id){
    await this.exist(id);
    await this.loadCarts();

    let exist = this.carts.find(cart=>cart.cartId === Number(id));

    let cartIndex = this.carts.indexOf(exist);
    return this.carts[cartIndex];
  }

  async addCart(cartToAdd){
    await this.loadCarts();
    
    let exist = this.carts.some(cart => cart.cartId === Number(cartToAdd.cartId));

    if(exist && !!cartToAdd.cartId)
      CustomError.createError({
        name: "El carrito ya existe",
        cause: cartAlreadyExist(cartToAdd.cartId),
        message: "El carrito que desea agregar ya existe.",
        code: EErrors.CARTS.CART_EXIST
      });

    cartToAdd.cartId = this.cartsId;
    this.carts.push(cartToAdd);
    this.cartsId++;

    this.writeCarts();

    return cartToAdd;
  }

  async updateCart(cartId, products){
    await this.exist(cartId);
    
    let carts = await this.getCarts();

    carts.map(cart=>{
      if(cart.cartId == Number(cartId)){
        cart.products = products;
      }
    })

    this.carts = carts;
    await this.writeCarts();
  }

  async addProductToCart(cartId, productToAdd){
    let cart = await this.getCartById(cartId);
    let cartIndex = this.carts.indexOf(cart);

    let productExist = cart.products.find(prod => prod.product === Number(productToAdd));

    if(!!productExist){
      let productIndex = cart.products.indexOf(productExist);

      this.carts[cartIndex].products[productIndex].quantity++;
    }else{
      this.carts[cartIndex].products.push({product: Number(productToAdd), quantity:1});
    }

    this.writeCarts();
  }

  async updateProductInCart(cartId, productToUpdate, qty){
    await this.exist(cartId);

    let carts = await this.getCarts();
    let updatedCart;
    let updatedProd;

    carts.map(cart=>{
      if(cart.cartId === Number(cartId)){
        cart.products.map(prod=>{
          if(prod.product === productToUpdate){
            prod.quantity = qty;
            updatedProd = prod;
          }
        })
        updatedCart = cart;
      }
    })

    if(!!!updatedProd){
      carts.map(cart=>{
        if(cart.cartId === Number(cartId)){
          cart.products.push({product: productToUpdate,quantity: qty});
        }
      })
    }

    this.carts = carts;
    await this.writeCarts();

    return updatedCart;
  }

  async deleteProductFromCart(cartId, productToDelete){
    await this.exist(cartId);

    let carts = await this.getCarts();
    let updatedCart;

    carts.map(cart=>{
      if(cart.cartId===Number(cartId)){
        if(!cart.products.some(prod=>prod.product === Number(productToDelete)))
        CustomError.createError({
          name: "El producto no existe en el carrito",
          cause: productNotInCart(productToDelete, cartId),
          message: `No existe el producto ${productToDelete} en el carrito ${cartId}`,
          code: EErrors.CARTS.PRODUCT_NOT_IN_CART
        });

        cart.products = cart.products.filter(prod=>prod.product !== Number(productToDelete));
        
        updatedCart = cart;
      }
    })

    this.carts = carts;
    await this.writeCarts();

    return updatedCart;
  }

  async deleteAllProductFromCart(cartId){
    await this.exist(cartId);

    let carts = await this.getCarts();
    let updatedCart;

    carts.map(cart=>{
      if(cart.cartId===Number(cartId)){
        cart.products = [];
        updatedCart = cart;
      }
    })

    this.carts = carts;
    await this.writeCarts();

    return updatedCart;
  }


  async readCarts(){
    return JSON.parse(await this.fs.readFile(this.path, "utf-8"));
  }

  async writeCarts(){    
    await this.fs.writeFile(this.path, JSON.stringify(this.carts, null, "\t"));
  }

  async loadCarts(){
    this.carts = await this.readCarts();
    this.cartsId = (!!this.carts.length) ? this.carts.reduce((a, b) => (a.cartId > b.cartId) ? a : b ).cartId+1 : 0;
  }
}

export default CartFsDAO;