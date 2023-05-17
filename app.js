import cluster from "cluster";
import { cpus } from "os";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import nodemailer from "nodemailer";
import twilio from "twilio";
import compression from "express-compression";

import { __dirname, addLogger} from "./utils.js";
import config from "./config/config.js";
import initializePassport from "./config/passport.config.js";
import MessageDbDAO from "./daos/message.db.dao.js";
import errorHandler from "./services/errors/errorHandler.middleware.js";

import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import mocksRouter from "./routes/mocks.router.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

if(cluster.isPrimary){
    console.log("Proceso primario, procede a crearse un worker process:");

    const numOfCpus = cpus().length;

    for (let i = 0; i < numOfCpus; i++) {
        cluster.fork();
    }
}else{
    console.log(`Worker process creado, ID: ${process.pid}`);
    
    const app = express();
    const server = app.listen(config.port, ()=>console.log(`Server live on http://${config.host}:${config.port}/`));
    const io = new Server(server);
    
    const messageDB = new MessageDbDAO();
    const conectedUsers = [];
    
    io.on("connection", socket=>{
        console.log("Cliente conectado.");
    
    
        socket.on("new_message", async message=>{
            await messageDB.addMessage(message);
    
            let messages = await messageDB.getMessages().lean();
            
            io.emit("messages_log", messages);
        });
    
        // Evento de nuevo usuario.
        socket.on("new_user", async user=>{
            let messages = await messageDB.getMessages().lean();
            let validationObj = {
                validation: true,
                user,
                messages
            }
    
            if(conectedUsers.includes(user)){
                validationObj.validation = false;
            }else{
                conectedUsers.push(user);
            }
    
            socket.emit("auth_user", validationObj);
            if(validationObj.validation) socket.broadcast.emit("new_user_connected", user);
        });
    })
    
    const mailer = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth:{
            user: "fran.drago@gmail.com",
            pass: config.google_app_password
        }
    })
    
    const twilioClient = twilio(config.twilio_account_sid, config.twilio_auth_token);
    
    const swaggerOptions = {
        definition:{
            openapi:"3.0.1",
            info:{
                title:"Proyecto coder",
                description: "Documentacion para la API de coder"
            }
        },
        apis:[`${__dirname}/docs/**/*.yaml`]
    }

    const specs = swaggerJsdoc(swaggerOptions);

    app.engine("handlebars", handlebars.engine());                  
    
    app.set("views", __dirname+"/views");                           
    app.set("view engine", "handlebars");                           
    
    app.use(express.static(__dirname+"/public"));                  
    app.use(express.urlencoded({extended:true}));                   
    app.use(express.json());                                        
    app.use(compression({brotli:{enabled:true, zlib:{}}}));         
    app.use(cookieParser());                                        
    app.use(session({                                               
        store: MongoStore.create({
            mongoUrl:config.mongo_url,
            mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true}
        }),
        secret:config.session_secret,
        resave:true,
        saveUninitialized:true
    }))
    initializePassport();
    app.use(passport.initialize());                                
    app.use(passport.session());                                    
    app.use(addLogger);                                             
    
    app.use((req, res, next)=>{     
        if(!!req.session.passport?.user){
            req.session.passport.user.abmPanel = (["ADMIN", "PREMIUM"].includes(req.session.passport.user.rol.toUpperCase())) ? true : false;
        }

        res.locals.session = req.session;
        res.locals.session.user = req.session.passport?.user;
        next();
    })
    
    app.use((req, res, next)=>{     
        req.io = io;
        req.mailer = mailer;
        req.twilioClient = twilioClient;
        
        next();
    })
    
    app.use("/", viewsRouter);
    app.use("/api/sessions/", sessionsRouter);
    app.use("/api/users/", usersRouter);
    app.use("/api/carts/", cartsRouter);
    app.use("/api/products/", productsRouter);
    app.use("/api/tests/", mocksRouter);

    app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

    app.use(errorHandler);
}