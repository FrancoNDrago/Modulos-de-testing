import { faker } from "@faker-js/faker";

import CartDTO from "../../dtos/response/cart.res.dto.js";
import CartProductDTO from "../../dtos/response/cartProduct.res.dto.js";
import { generateProduct } from "./products.mock.js";

faker.locale = "es";

export const generateCartProduct = ()=>{
    return new CartProductDTO({
        product:generateProduct(),
        quantity: faker.random.numeric(2)
    })
}

export const generateCartproducts = qty=>{
    let cartProducts = [];

    for (let i = 0; i < qty; i++) {
        cartProducts.push(generateCartProduct());
    }

    return cartProducts;
}

export const generateCart = ()=>{
    return new CartDTO({
        _id: faker.random.alphaNumeric(10),
        products: generateCartproducts(Math.random()*20)
    })
}

export const generateCarts = qty=>{
    let carts = [];

    for (let i = 0; i < qty; i++) {
        carts.push(generateCart());
    }

    return carts;
}