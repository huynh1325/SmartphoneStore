import express from "express"
import homeController from "../controller/homeController";
import apiController from "../controller/apiController";
import productController from "../controller/productController";
import userController from "../controller/userController";
import cartController from "../controller/cartController";
import stockInController from "../controller/stockInController";
import supplierController from "../controller/supplierController";
import paymentController from '../controller/paymentController';
import orderController from '../controller/orderController';
import voucherController from '../controller/voucherController';
import addressController from '../controller/addressController';
import colorProductController from '../controller/colorProductController';
import statisticalController from '../controller/statisticalController';
import invoiceController from '../controller/invoiceController';
import multer from "multer";
import path from 'path';
import auth from '../middleware/auth';
var appRoot = require('app-root-path');
 
const router = express.Router();
const appE = express()

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

appE.use('/image', express.static(appRoot + '/src/public/image'));

const initWebRoutes = (app) => {
    router.get("/", homeController.handleHelloWorld);
    
    //login register
    router.post("/register", apiController.handleRegister);
    router.post("/verify-user", apiController.handleVerifyUser);
    router.post("/login", apiController.handleLogin);

    //user
    router.get("/users", userController.getAllUser);
    router.put("/update-user", userController.updateUserInfo);
    
    //product
    router.get("/products/search", productController.handleSearchProductByName);
    router.get("/products/filter", productController.handleFilterProductByBrand);
    router.get("/products/:maSanPham", productController.getProduct)
    router.get("/products", productController.getAllProduct);
    router.post("/products", upload.single('anh'), productController.handleCreateProduct);
    router.put("/products/:maSanPham", upload.single('anh'), productController.handleUpdateProduct);
    router.delete("/products/:maSanPham", upload.single('anh'), productController.handleDeleteProduct);
    
    //cart
    router.post("/carts/add", auth, cartController.handleAddToCart);
    router.get("/carts", auth, cartController.getAllCart);
    router.delete("/carts/:maChiTietGioHang", auth ,cartController.deleteFromCart);

    //stockin
    router.get("/stockin", stockInController.getAllStockIn);
    router.post("/stockin", stockInController.handleCreateStockIn);
    
    //supplier
    router.get("/suppliers", supplierController.getAllSupplier);
    router.post("/suppliers", supplierController.handleCreateSupplier);
    
    //order
    router.post('/orders', auth, orderController.handleCreateOrder);
    router.put('/orders/:maDonHang', auth, orderController.handleUpdateOrderStatus);
    router.get('/orders/:maDonHang', auth, orderController.getOrderById);
    router.get('/orders', auth, orderController.getOrdersByUser);

    //checkout
    router.post('/create-payment-url', auth, paymentController.createPaymentUrl);
    router.get('/vnpay-return', paymentController.vnpayReturn);

    //invoice
    router.get('/invoice/:maDonHang', invoiceController.handleGetInvoiceDetail);

    //address
    router.post('/address', auth, addressController.handleCreateAddress);
    router.get('/address', auth, addressController.getAddressByUser);
    
    //productcolor
    router.get('/productcolor/:maSanPham', colorProductController.getAllColorProduct);

    //voucher
    router.post('/vouchers', voucherController.handleCreateVoucher);
    router.get('/vouchers', voucherController.fetchAllVoucher);
    router.get('/vouchers/:maNhap', voucherController.getVoucherByCodeInput);
    router.put('/vouchers/:maKhuyenMai', voucherController.handleUpdateVoucher);
    router.delete('/vouchers/:maKhuyenMai', voucherController.handleDeleteVoucher);
    
    //statistical
    router.get('/dashboard', statisticalController.getDashboardStats);
    router.get('/top-selling', statisticalController.getTopSellingProducts);
    router.get('/revenue-last-10-days', statisticalController.getRevenueLast10Days);

    return app.use("/api/v1/", router);
}

export default initWebRoutes;