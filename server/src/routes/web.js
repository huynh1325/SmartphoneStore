import express from "express"
import homeController from "../controller/homeController";
import apiController from "../controller/apiController";
import productController from "../controller/productController"
import multer from "multer";
import path from 'path';
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
    
    // router.post('/upload-file', upload.single('image-product'), productController.handleUploadFile);
    router.post("/register", apiController.handleRegister);
    router.post("/product", upload.single('anh'), productController.handleCreateProduct);
    router.put("/product/:maSanPham", upload.single('anh'), productController.handleUpdateProduct);
    router.delete("/product/:maSanPham", upload.single('anh'), productController.handleDeleteProduct);
    router.get("/products", productController.getAllProducts);
    
    return app.use("/api/v1/", router);
}

export default initWebRoutes;