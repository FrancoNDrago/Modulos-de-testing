class ProductDTO{
  constructor(product){
    this._id = product._id || product.id || undefined;
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price || 0;
    this.status = product.status || true;
    this.stock = product.stock || 0;
    this.category = product.category;
    this.thumbnails = product.thumbnails || [];
    this.owner = product.owner || "admin";
  }
}

export default ProductDTO;