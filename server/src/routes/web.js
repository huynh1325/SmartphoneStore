import express from "express"
import stockInController from "../controller/stockInController";
import homeController from "../controller/homeController";
import apiController from "../controller/apiController";
import productController from "../controller/productController";
import userController from "../controller/userController";
import cartController from "../controller/cartController";
import supplierController from "../controller/supplierController";
import multer from "multer";
import path from 'path';
import auth from '../middleware/auth'
var appRoot = require('app-root-path');
 
const router = express.Router();
const app = express()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/src/public/image/");
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp)$/)) {
        req.fileValidationError = 'Chỉ có thể upload file image!';
        return cb(new Error('Chỉ có thể upload file image!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

app.use('/image', express.static(appRoot + '/src/public/image'));

const initWebRoutes = (app) => {
    router.get("/", homeController.handleHelloWorld);

    router.get("/stock", stockInController.getAllStockIn);
    router.post("/stockin", stockInController.handleCreateStockIn);
    
    router.post("/register", apiController.handleRegister);
    router.post("/verify-user", apiController.handleVerifyUser);
    router.post("/login", apiController.handleLogin);
    router.get("/users", userController.getAllUser);
    
    router.get("/products/:maSanPham", productController.getProduct)
    router.get("/products", productController.getAllProduct);
    router.post("/products", upload.single('anh'), productController.handleCreateProduct);
    router.put("/products/:maSanPham", upload.single('anh'), productController.handleUpdateProduct);
    router.delete("/products/:maSanPham", upload.single('anh'), productController.handleDeleteProduct);
    
    router.post("/carts/add", auth, cartController.handleAddToCart);
    router.get("/carts", auth, cartController.getAllCart);
    
    
    router.get("/suppliers", supplierController.getAllSupplier);
    
    return app.use("/api/v1/", router);
}

export default initWebRoutes;