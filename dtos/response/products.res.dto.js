class ProductsDTO{
    constructor(products){
        this.products = products.products;
        this.totalPages = products.totalPages;
        this.prevPage = products.prevPage;
        this.nextPage = products.nextPage;
        this.page = products.page;
        this.hasPrevPage = products.hasPrevPage;
        this.hasNextPage = products.hasNextPage;
        this.prevLink = products.prevLink;
        this.nextLink = products.nextLink;
    }
}

export default ProductsDTO;