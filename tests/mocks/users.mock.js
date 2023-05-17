import { faker } from "@faker-js/faker";

import UserDTO from "../../dtos/request/user.req.dto.js";
import { generateCart } from './carts.mock.js';

faker.locale = "es";

const randomRol = ()=>{
    let roles = ["user", "admin"];
    let randomIndex = Math.round(Math.random()*roles.length);

    return roles[randomIndex];
}

export const generateUser = ()=>{
    return new UserDTO({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        age: faker.random.numeric(2),
        password: faker.internet.password(16),
        rol: randomRol(),
        cart: generateCart()
    })
}

export const generateUsers = qty=>{
    let users = [];

    for (let i = 0; i < qty; i++) {
        users.push(generateUser());
    }

    return users;
}