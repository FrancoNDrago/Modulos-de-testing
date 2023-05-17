import userModel from "./models/user.model.js";
import cartModel from "./models/cart.model.js";

class UserDbDAO{

    constructor(){}

    async addUser(userToAdd){
        let cart = await cartModel.create({});

        userToAdd.cart = cart["_id"];

        return userModel.create(userToAdd);
    }

    getUserByEmail(email){
        return userModel.findOne({email});
    }

    getUserById(id){
        return userModel.findById(id);
    }
    
    updateUserPassword(id, new_password){
        return userModel.updateOne({_id:id}, {password: new_password});
    }

    updateUserRol(id, new_rol){
        return userModel.updateOne({_id:id}, {rol: new_rol});
    }

}

export default UserDbDAO;