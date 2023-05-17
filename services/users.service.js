import { UsersFty } from "../daos/factory.js";
import { createHash } from "../utils.js";

class UserService{
    constructor(){
        this.persistanceEngine = new UsersFty();
    }

    addUser(userToAdd){
        return this.persistanceEngine.addUser(userToAdd);
    }

    getUserByEmail(email){
        return this.persistanceEngine.getUserByEmail(email);
    }

    getUserById(id){
        return this.persistanceEngine.getUserById(id);
    }

    updateUserPassword(id, new_password){
        const password = createHash(new_password);
        
        return this.persistanceEngine.updateUserPassword(id, password);
    }

    async changeRol(id){
        const user = await this.persistanceEngine.getUserById(id);
        let new_rol;

        if(user.rol.toUpperCase() === "PREMIUM"){
            new_rol = "user";
        }else if (user.rol.toUpperCase() === "USER") {
            new_rol = "premium";
        }

        await this.persistanceEngine.updateUserRol(id, new_rol);

        return new_rol;
    }
}

export default UserService;