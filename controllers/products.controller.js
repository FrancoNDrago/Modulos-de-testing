import ProductService from "../services/products.service.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { notOwner } from "../services/errors/info/products.error.info.js";

class ProductController{
    constructor(){
        this.productService = new ProductService();
    }

    getProducts({limit=10, page=1, query='{}', sort=1}){
        return this.productService.getProducts(limit, page, query, sort);
    }

    getProduct(id){
        return this.productService.getProduct(id);
    }

    addProduct(product){
        return this.productService.addProduct(product);
    }

    async updateProduct(id, newData, user){
        let product = await this.getProduct(id);

        if(user.rol.toUpperCase() === 'PREMIUM' && String(user._id) !== String(product.owner)) 
            CustomError.createError({
                name: "No es propietario",
                cause: notOwner(),
                message: `No se puede modificar el producto ya que el usuario no es propietario de este`,
                code: EErrors.PRODUCTS.NOT_OWNER
            });

        return this.productService.updateProduct(id, newData);
    }

    async deleteProduct(id, user){
        let product = await this.getProduct(id);

        if(user.rol.toUpperCase() === 'PREMIUM' && String(user._id) !== String(product.owner)) 
            CustomError.createError({
                name: "No es propietario",
                cause: notOwner(),
                message: `No se puede eliminar el producto ya que el usuario no es propietario del mismo.`,
                code: EErrors.PRODUCTS.NOT_OWNER
            });

        return this.productService.deleteProduct(id);
    }
}

export default ProductController;