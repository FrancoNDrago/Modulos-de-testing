import { Router } from "express";

import { generateProducts } from "../tests/mocks/products.mock.js";
import { generateUsers } from "../tests/mocks/users.mock.js";

const mocksRouter = Router();

mocksRouter.get("/mockingproducts", (req, res, next)=>{
    try {
        let qty = req.query.qty || 50;
    
        const products = generateProducts(qty);
    
        res.send({status:"success", payload:products});
    } catch (error) {
        next(error);
    }
})

mocksRouter.get("/mockingusers", (req, res, next)=>{
    try {
        let qty = req.query.qty || 20;
    
        const users = generateUsers(qty);
    
        res.send({status:"success", payload:users});
    } catch (error) {
        next(error);
    }
})

mocksRouter.get("/loggerTest", (req, res, next)=>{
    try{
        req.logger.info(`Endpoint para test de logger [${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}]`);

        req.logger.fatal("Mensaje de logger nivel FATAL");
        req.logger.error("Mensaje de logger nivel ERROR");
        req.logger.warning("Mensaje de logger nivel WARNING");
        req.logger.info("Mensaje de logger nivel INFO");
        req.logger.http("Mensaje de logger nivel HTTP");
        req.logger.debug("Mensaje de logger nivel DEBUG");

        res.send({status: "success"});
    }catch (error){
        next(error);
    }
})

export default mocksRouter;