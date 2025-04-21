import express from "express"
import homeController from "../controller/homeController";
import apiController from "../controller/apiController";
 
const router = express.Router();

/**
 * 
 * @param {*} app :express app
 */

const initWebRoutes = (app) => {
    router.get("/", homeController.handleHelloWorld);
    
    router.post("/register", apiController.handleRegister);
    
    return app.use("/", router);
}

export default initWebRoutes;