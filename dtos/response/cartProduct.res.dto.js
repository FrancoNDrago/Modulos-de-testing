class CartProductDTO{
    constructor(cartProduct){
        this.product = cartProduct.product;
        this.quantity = cartProduct.quantity;
    }
}

export default CartProductDTO;