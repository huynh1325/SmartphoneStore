import productService from '../service/productService'
import db from '../models/index'

const getAllProducts = async (req, res) => {
    try {
        let products = await db.SanPham.findAll({
            order: [['maSanPham', 'DESC']]
        });
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
const handleCreateProduct = async (req, res) => {
    
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

const handleUpdateProduct = async (req, res) => {

    const maSanPham = req.params.maSanPham;
    const imageFile = req.file;
    
    let productData = {
        ...req.body,
        maSanPham
    }

    if (imageFile) {
        productData.image = `/image/${imageFile.filename}`;
    }

    let data = await productService.updateProduct(productData);
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data
    })
    
}

const handleDeleteProduct = async (req, res) => {

    const maSanPham = req.params.maSanPham;
    
    const data = await productService.deleteProduct(maSanPham);
    
    return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT
    });
    
}

module.exports = {
    handleCreateProduct, getAllProducts, handleUpdateProduct, handleDeleteProduct
}