import { faker } from "@faker-js/faker";

import ProductDTO from "../../dtos/response/product.res.dto.js";

faker.locale = "es";

export const generateProduct = ()=>{
    return new ProductDTO({
        _id: faker.random.alphaNumeric(10),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric(5),
        price: Number(faker.random.numeric(4)),
        status: true,
        stock: Number(faker.random.numeric(3)),
        category: faker.commerce.department(),
        thumbnails: [faker.image.imageUrl()]
    })
}

export const generateProducts = qty=>{
    const products = [];

    for (let i = 0; i < qty; i++) {
        products.push(generateProduct());
    }

    return products;
}