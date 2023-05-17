import fs from "fs";
import { __dirname } from "../utils.js";
import CartFsDAO from "./cart.fs.dao.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { idNotFound, emailNotFound } from "../services/errors/info/users.error.info.js";

class UserFsDAO{

    constructor(){
        this.fs = fs.promises;
        this.path = __dirname+"/fs_persistance/users.json";
        this.users = [];
        this.userId = 0;

        this.cartDAO = new CartFsDAO(__dirname+"/fs_persistance/carts.json");
        
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, "[]");
        }

        this.loadUsers();
    }

    async addUser(userToAdd){
        let users = await this.readUsers();
        let newCart = this.cartDAO.addCart({products: []});

        userToAdd.cart = newCart;

        users.push(userToAdd);

        this.users = users;
        await this.writeUsers();

        return userToAdd;
    }

    async getUserByEmail(email){
        let users = await this.readUsers();

        let user = users.find(user=>user.email === email);

        if(!!!user)
            CustomError.createError({
                name: "Error de autenticacion",
                cause: emailNotFound(email),
                message: `No se encontro el usuario con el email ${email}`,
                code: EErrors.USERS.USER_EMAIL_NOT_FOUND
            });

        return user;
    }

    async getUserById(id){
        let users = await this.readUsers();

        let user = users.find(user=>user.id === id);

        if(!!!user)
            CustomError.createError({
                name: "Error de autenticacion",
                cause: idNotFound(id),
                message: `No se encontro el usuario con el ID ${id}.`,
                code: EErrors.USERS.USER_ID_NOT_FOUND
            });

        return user;
    }

    async updateUserPassword(id, new_password){
        let users = await this.readUsers();

        users.forEach(user => {
            if(user.id === id){
                user.password = new_password;
            }
        });

        this.users = users;
        
        this.writeUsers();
    }

    async updateUserRol(id, new_rol){
        let users = await this.readUsers();

        users.forEach(user=>{
            if(user.id === id){
                user.rol = new_rol;
            }
        })

        this.users = users;

        this.writeUsers();
    }

    async readUsers(){
        return JSON.parse(await this.fs.readFile(this.path, 'utf-8'));
    }

    async writeUsers(){
        await this.fs.writeFile(this.path, JSON.stringify(this.users, null, "\t"));
    }

    async loadUsers(){
        this.users = await this.readUsers();
        this.userId = (!!this.users.length) ? this.users.reduce((a, b) => (a.id > b.id) ? a : b ).id+1 : 0;
    }

}

export default UserFsDAO;