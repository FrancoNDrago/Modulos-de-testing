import { Router } from "express";

import CartController from "../controllers/carts.controller.js";
import ProductController from "../controllers/products.controller.js";
import TicketController from "../controllers/ticket.controller.js";
import { handlePolicies } from "../utils.js";
import config from "../config/config.js";

const cartsRouter = Router();

const cartController = new CartController;
const productController = new ProductController;
const ticketController = new TicketController;

cartsRouter.get("/:cid", async (req, res, next)=>{
    try {
        let cid = req.params.cid;
        
        let cartToShow = await cartController.getCart(cid, true);
        
        if(!!cartToShow){
            res.send({status:"success", payload:cartToShow.products});
        }else{
            res.status(404).send({status:"error", message:`No se encontro carrito con el ID ${cid}`});
        }
    } catch (error) {
        next(error);
    }
})

cartsRouter.post("/:cid", async (req, res, next)=>{
    try {
        let newCart = req.body;
    
        const addedCart = await cartController.addCart(newCart);
        
        res.send({status:"success", message: `El carrito fue agregado con exito. ID: ${addedCart?._id || addedCart?.cartId}`});
    } catch (error) {
        next(error);
    }
})

cartsRouter.post("/:cid/product/:pid", handlePolicies(["USER"]), async (req, res, next)=>{
    try {
        let productId = req.params.pid;
        let cartId = req.params.cid;
    
        await cartController.addProductToCart(cartId, productId);
    
        res.send({status: "success", message: `Producto ${productId} cargado al carrito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

cartsRouter.put("/:cid", async (req, res, next)=>{
    try {
        const cartId = req.params.cid;
        const { products } = req.body;

        await cartController.updateCart(cartId, products);

        res.send({status: "success", message: `Carrito modificado con exito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

cartsRouter.put("/:cid/product/:pid", async (req, res, next)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
    
        await cartController.updateProdQty(cartId, productId, quantity);
    
        res.send({status: "success", message: `Se modifico la cantidad del producto ${productId} por ${quantity}. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

cartsRouter.delete("/:cid/product/:pid", async (req, res, next)=>{
    try {
        let cartId = req.params.cid;
        let productId = req.params.pid;
    
        await cartController.deleteProduct(cartId, productId);

        res.send({status: "success", message: `Producto ${productId} eliminado del carrito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

cartsRouter.delete("/:cid", async (req, res, next)=>{
    try {
        let cartId = req.params.cid;
    
        await cartController.deleteAllProducts(cartId);

        res.send({statis: "success", message: `Se eliminaron todos los productos del carrito. ID: ${cartId}.`});
    } catch (error) {
        next(error);
    }
})

cartsRouter.get("/:cid/purchase", async (req, res, next)=>{
    try {
        let cid = req.params.cid;
        let cart = await cartController.getCart(cid, true);
        let totalCompra = 0;
        let soldItems = [];
        let itemsOutOfStock = [];
        let phone = req.query.phone;
        
        cart.products.forEach(async (prod)=>{
            if(prod.product.stock > 0 || prod.product.stock >= prod.quantity) {
                productController.updateProduct(prod.product._id, {stock: prod.product.stock-prod.quantity});
                cartController.deleteProduct(cart._id.toString(), prod.product._id.toString());
                soldItems.push(prod.product.title);
                totalCompra += prod.product.price*prod.quantity;
            }else{
                itemsOutOfStock.push({
                    id:prod.product._id,
                    title:prod.product.title,
                    stock: prod.product.stock, 
                    quantity:prod.quantity
                });
            }
        });
        
        if(soldItems.length > 0){
            let ticketData = {
                code: `TCKT-${Date.now()}`,
                amount: totalCompra,
                purchaser: req.user.email
            }
    
            let ticket = await ticketController.generateTicket(ticketData);

            let mail_body = `<div>
                                <h1>Su compra se realizo con exito!</h1>
                                <p> Buen dia ${req.user.first_name} ${req.user.last_name}! tu compra de los siguientes productos fue realizada con el ticket N° ${ticket._id}</p>
                                <ul>`;
    
            soldItems.forEach(item=>mail_body += `<li>${item}</li>`);
            mail_body += `</ul>
                        <br>
                        <p>Muchas gracias por tu compra!</p>
                        <p>Que tengas buen dia.</p>`;
    
            req.mailer.sendMail({
                from: "Adidas <noreplay@email.com",
                to: req.user.email,
                subject: "Compra realizada con exito!",
                html:mail_body,
                attachments:[]
            })

            if(!!phone){
                req.twilioClient.messages.create({
                    body: `Su compra en Adidas fue realizada con el N° de ticket ${ticket._id}`,
                    from: config.twilio_sms_number,
                    to: `+54${phone}`
                })
            }

            res.send({status:"success", payload:{ticket:ticket._id, products_out_of_stock:itemsOutOfStock}});
        }else{
            res.send({status:"error", message:"No se pudo realizar la compra debido a una falta de stock."});
        }

    } catch (error) {
        next(error);
    }
})

export default cartsRouter;