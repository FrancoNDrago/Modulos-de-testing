import mongoose from "mongoose";
import config from "../config/config.js";

export let CartsFty;
export let ProductsFty;
export let TicketFty;
export let UsersFty;
export let MessagesFty;

switch (config.persistance_engine.toUpperCase()) {
    case "MONGO":
        const connection = mongoose.connect(config.mongoUrl, (error)=>{
            if(error){
                console.log("Cannot connect to database: "+error);
                process.exit();
            }
        })

        const {default: CartDbDAO} = await import("./cart.db.dao.js");
        const {default: ProductDbDAO} = await import("./product.db.dao.js");
        const {default: TicketDAO} = await import("./ticket.db.dao.js");
        const {default: UserDbDAO} = await import("./user.db.dao.js");
        const {default: MessageDbDAO} = await import("./user.db.dao.js");

        CartsFty = CartDbDAO;
        ProductsFty = ProductDbDAO;
        TicketFty = TicketDAO;
        UsersFty = UserDbDAO;
        MessagesFty = MessageDbDAO;
        break;

    case "FS":
        const {default: CartFsDAO} = await import("./cart.fs.dao.js");
        const {default: ProductFsDAO} = await import("./product.fs.dao.js");
        const {default: UserFsDAO} = await import("./user.fs.dao.js");
        const {default: MessageFsDAO} = await import("./user.fs.dao.js");

        CartsFty = CartFsDAO;
        ProductsFty = ProductFsDAO;
        UsersFty = UserFsDAO;
        MessagesFty = MessageFsDAO;
        break;  
}