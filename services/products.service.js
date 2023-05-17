import { __dirname } from "../utils.js";
import { ProductsFty } from "../daos/factory.js";

class ProductService{
    constructor(){
        this.persistanceEngine = new ProductsFty();
    }

    getProducts(limit=10, page=1, query="{}", sort=1){
        query = !!query ? JSON.parse(query) : {};

        if(!!query.stock && (!!!query.maxStock || !!!query.minStock))
            query.stock = (query.stock === 1) ? {$gt: 0} : {$gte: 0};
        if(!!query.maxStock){
            query.stock = query.stock || {};
            query.stock.$lt = query.maxStock;
            delete query.maxStock;
        }
        if(!!query.minStock){
            query.stock = query.stock || {};
            query.stock.$gt = query.minStock;
            delete query.minStock;
        }
        if(!!query.category){
            query.category = {$eq: query.category};
        }
        if(!!query.owner){
            query.owner = {$eq: query.owner};
        } 
        
        return this.persistanceEngine.getProducts(limit, page, query, sort);
    }

    getProduct(id){
        return this.persistanceEngine.getProductById(id);
    }

    addProduct(product){
        return this.persistanceEngine.addProduct(product);
    }

    updateProduct(id, newData){
        return this.persistanceEngine.updateProduct(id, newData);
    }

    deleteProduct(id){
        return this.persistanceEngine.deleteProduct(id);
    }
}

export default ProductService;