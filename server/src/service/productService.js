import db from '../models/index'
const deleteImage = require('../utils/deleteImage'); 

const newProduct = async (rawData) => {
    const t = await db.sequelize.transaction();

    try {
        const product = await db.SanPham.create({
            maSanPham: rawData.maSanPham,
            tenSanPham: rawData.tenSanPham,
            heDieuHanh: rawData.heDieuHanh,
            cpu: rawData.cpu,
            ram: rawData.ram,
            dungLuongLuuTru: rawData.dungLuongLuuTru,
            chipDoHoa: rawData.chipDoHoa,
            theNho: rawData.theNho,
            gia: rawData.gia,
            inch: rawData.inch,
            nhanHieu: rawData.nhanHieu,
            phanTramGiam: rawData.phanTramGiam,
            anh: rawData.image
        })

        if (rawData.mau) {
            let mauList = rawData.mau;

            if (typeof rawData.mau === 'string') {
                mauList = JSON.parse(rawData.mau);
            }

            for (let mauItem of mauList) {
                await db.MauSanPham.create({
                    maSanPham: product.maSanPham,
                    mau: mauItem
                }, { transaction: t });
            }
        }

        await t.commit();

        return {
            EM: 'Thêm sản phẩm thành công',
            EC: 0
        }
    } catch (e) {
        console.log(e)
        await t.rollback();
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const updateProduct = async (data) => {

    try {
        if (!data) {
            return {
                EM: 'Không có dữ liệu',
                EC: 1,
                DT: ''
            }
        }

        let sanPham = await db.SanPham.findOne({
            where: { maSanPham: data.maSanPham }
        })

        let anhCapNhat = sanPham.anh;

        if (data.image) {
            anhCapNhat = data.image;
        }

        if (sanPham) {
            await db.SanPham.update({
                maSanPham: data.maSanPham,
                tenSanPham: data.tenSanPham,
                heDieuHanh: data.heDieuHanh,
                cpu: data.cpu,
                ram: data.ram,
                dungLuongLuuTru: data.dungLuongLuuTru,
                gia: data.gia,
                inch: data.inch,
                chipDoHoa: data.chipDoHoa,
                theNho: data.theNho,
                nhanHieu: data.nhanHieu,
                mau: data.mau,
                phanTramGiam: data.phanTramGiam,
                anh: anhCapNhat
            },
            {
                where: { maSanPham: data.maSanPham }
            }
            )

            return {
                EM: 'Cập nhật sản phẩm thành công!',
                EC: 0
            }

        } else {
            return {
                EM: 'Không tìm thấy sản phẩm',
                EC: 2,
                DT: ''
            }
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const deleteProduct = async (maSanPham) => {
    try {

        const sanPham = await db.SanPham.findOne({
            where: { maSanPham }
        })

        if (!sanPham) {
            return {
                EM: 'Không tìm thấy sản phẩm để xóa',
                EC: 2,
                DT: ''
            };
        }

        if (sanPham.anh) {
            deleteImage(sanPham.anh);
        }

        await db.SanPham.destroy({
            where: { maSanPham }
        });

        return {
            EM: 'Xóa sản phẩm thành công!',
            EC: 0,
            DT: ''
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

const fetchAllProducts = async () => {
    const Sequelize = db.Sequelize;

    let products = await db.SanPham.findAll({
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: db.MauSanPham,
                as: 'MauSanPham',
                attributes: [],
            },
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn('SUM', Sequelize.col('MauSanPham.soLuong')),
                        0
                    ),
                    'soLuong'
                ]
            ],
        },
        group: ['SanPham.maSanPham']
    });

    const productWithSuppliers = await Promise.all(products.map(async (product) => {
        const chiTietPhieuNhaps = await db.ChiTietPhieuNhap.findAll({
            where: {
                maSanPham: product.maSanPham
            },
            include: {
                model: db.PhieuNhap,
                include: {
                    model: db.NhaCungCap,
                    attributes: ['tenNhaCungCap']
                }
            }
        });

        const suppliers = chiTietPhieuNhaps
            .map(receipt => receipt.PhieuNhap?.NhaCungCap?.tenNhaCungCap)
            .filter(Boolean);

        return {
            ...product.toJSON(),
            nhaCungCap: suppliers
        };
    }));

    return productWithSuppliers;
}

const searchProductByName = async (tenSanPham) => {
    const Sequelize = db.Sequelize;

    const products = await db.SanPham.findAll({
        where: {
            tenSanPham: {
                [Sequelize.Op.like]: `%${tenSanPham}%`
            }
        },
        include: [
            {
                model: db.MauSanPham,
                as: 'MauSanPham',
                attributes: []
            }
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn(
                        'COALESCE',
                        Sequelize.fn('SUM', Sequelize.col('MauSanPham.soLuong')),
                        0
                    ),
                    'soLuong'
                ]
            ]
        },
        order: [['maSanPham', 'DESC']],
        group: ['SanPham.maSanPham']
    });

    return products.map(product => product.toJSON());
};

const filterProductByBrand = async (nhanHieu) => {
    try {
        const Sequelize = db.Sequelize;

        let products = await db.SanPham.findAll({
            where: {
                nhanHieu: nhanHieu
            },
            include: [
                {
                    model: db.MauSanPham,
                    as: 'MauSanPham',
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [
                        Sequelize.fn(
                            'COALESCE',
                            Sequelize.fn('SUM', Sequelize.col('MauSanPham.soLuong')),
                            0
                        ),
                        'soLuong'
                    ]
                ]
            },
            group: ['SanPham.maSanPham'],
            order: [['maSanPham', 'DESC']]
        });

        return products.map(product => product.toJSON());
    } catch (e) {
        console.log(e);
        return [];
    }
};

module.exports = {
    newProduct, updateProduct, deleteProduct, fetchAllProducts, searchProductByName, filterProductByBrand
}