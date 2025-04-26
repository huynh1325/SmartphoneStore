import db from '../models/index'

const newProduct = async (rawData) => {

    try {
        await db.Product.create({
            name: rawData.name,
            os: rawData.os,
            description: rawData.description,
            ram: rawData.ram,
            rom: rawData.rom,
            price: rawData.price,
            inch: rawData.inch,
            countryOfOrigin: rawData.country,
            brand: rawData.brand,
            discount: rawData.discount,
            image: rawData.image
        })

        return {
            EM: 'Thêm sản phẩm thành công',
            EC: 0
        }
    } catch (e) {
        console.log(e)
        return {
            EM: 'Something wrongs in service...',
            EC: -2
        }
    }
}

module.exports = {
    newProduct
}