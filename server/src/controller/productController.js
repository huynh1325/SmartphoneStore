import productService from '../service/productService'
import db from '../models/index'

const getProduct = async (req, res) => {
    try {
        const { maSanPham } = req.params;
        
        let products = await db.SanPham.findOne({
            where: {maSanPham: maSanPham},
        });
        return res.status(200).json({
            EM: "Lấy sản phẩm thành công",
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

const getAllProduct = async (req, res) => {
    try {
        const products = await productService.fetchAllProducts();
        return res.status(200).json({
            EC: 0,
            EM: "Lấy sản phẩm thành công",
            DT: products,
        });
    }
    catch (e) {
        console.error("Lỗi khi lấy sản phẩm:", e);
        return res.status(500).json({
            EC: -1,
            EM: "Lỗi server",
        });
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
            EC: data.EC
        })

    } catch (e) {
        return res.status(500).json({
            EM: data.EM,
            EC: data.EC
        })
    }
}

const handleUpdateProduct = async (req, res) => {

    try {
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
            EC: data.EC
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            EM: data.EM,
            EC: data.EC
        })
    }
    
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

const handleSearchProductByName = async (req, res) => {
    try {
        const { tenSanPham } = req.query;
        
        console.log(tenSanPham)

        if (!tenSanPham) {
            return res.status(400).json({
                EC: 1,
                EM: "Tên sản phẩm không được để trống",
                DT: []
            });
        }

        const products = await productService.searchProductByName(tenSanPham);
        return res.status(200).json({
            EC: 0,
            EM: "Tìm kiếm sản phẩm thành công",
            DT: products
        });
    } catch (e) {
        console.log("Lỗi khi tìm kiếm sản phẩm:", e);
        return res.status(500).json({
            EC: -1,
            EM: "Lỗi server",
            DT: []
        });
    }
};

const handleFilterProductByBrand = async (req, res) => {
    try {
        const { nhanHieu } = req.query;

        if (!nhanHieu) {
            return res.status(400).json({
                EC: 1,
                EM: "Nhãn hiệu không được để trống",
                DT: []
            });
        }

        const products = await productService.filterProductByBrand(nhanHieu);
        return res.status(200).json({
            EC: 0,
            EM: "Lọc sản phẩm theo nhãn hiệu thành công",
            DT: products
        });
    } catch (e) {
        console.log("Lỗi khi lọc sản phẩm:", e);
        return res.status(500).json({
            EC: -1,
            EM: "Lỗi server",
            DT: []
        });
    }
};

module.exports = {
    handleCreateProduct, getAllProduct, handleUpdateProduct, handleDeleteProduct, getProduct, handleSearchProductByName, handleFilterProductByBrand
}