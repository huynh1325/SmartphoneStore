import productService from '../service/productService'
import db from '../models/index'

const getAllProducts = async (req, res) => {
    try {
        const products = await db.Product.findAll();
        return res.status(200).json({
            EM: "Lấy danh sách sản phẩm thành công",
            EC: 0,
            DT: products
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: 'error from server',
            EC: -1,
            DT: []
        })
    }
}
const handleAddProduct = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ EC: 1, EM: "Chưa tải ảnh lên" });
    }

    try {

        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({
                EM: 'No image file uploaded',
                EC: '400',
                DT: 'Please upload an image for the product.'
            });
        }
        
        const productData = {
                ...req.body,
                image: `/image/${imageFile.filename}`
            };

        let data = await productService.newProduct(productData)

        console.log(productData)
        
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: ''
        })

    } catch (e) {
        return res.status(500).json({
            EM: 'error from server',
            EC: '-1',
            DT: ''
        })
    }
}


module.exports = {
    handleAddProduct, getAllProducts
}