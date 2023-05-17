class CartDTO{
  constructor(cart){
    this._id = cart._id || cart.id;
    this.products = cart.products;
  }
}

export default CartDTO;