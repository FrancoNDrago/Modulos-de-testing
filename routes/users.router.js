import { Router } from "express";

import UserService from "../services/users.service.js";
import { handlePolicies } from "../utils.js";

const usersRouter = Router();

const userService = new UserService();

usersRouter.get("/premium/:uid", handlePolicies(["PREMIUM"]), async (req, res, next)=>{
    try {
        const uid = req.params.uid;

        let changeRol = await userService.changeRol(uid);

        res.send({status:"success", payload:`Rol de usuario modificado a ${changeRol.toUpperCase()}.`});
    } catch (error) {
        next(error);
    }
})

export default usersRouter;