import styles from './Product.module.scss'
import classNames from 'classnames/bind';
import { useState } from 'react';
import { addProduct } from '../../util/api';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const Product = (props) => {
    const [name, setName] = useState('');
    const [os, setOs] = useState('');
    const [description, setDescription] = useState('');
    const [ram, setRam] = useState('');
    const [rom, setRom] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [country, setCountry] = useState('');
    const [discount, setDiscount] = useState('');
    const [inch, setInch] = useState('');

    const [image, setImage] = useState(null);
    
        // const handleOverlayClick = (e) => {
        //     if (e.target === e.currentTarget) {
        //         props.onClose();
        //     }
        // };

    const handleChangeImage = (e) => {
        setImage(e.target.files[0]);
    };

    

    const handleAddProduct = async () => {

        // if (!name || !os || !description || !ram || !rom || !price || !brand || !country || !discount || !inch) {
        //     toast.error("Vui lòng điền đầy đủ thông tin sản phẩm!");
        //     return;
        // }
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("os", os);
        formData.append("description", description);
        formData.append("ram", ram);
        formData.append("rom", rom);
        formData.append("inch", inch);
        formData.append("price", price);
        formData.append("country", country);
        formData.append("brand", brand);
        formData.append("discount", discount);

        console.log(...formData)
    
        if (image) {
            formData.append("image-product", image);
        }
    
        try {
            const res = await fetch("http://localhost:8080/api/v1/addproduct", {
                method: "POST",
                body: formData,
            });
    
            const data = await res.json();
            if (data.EC === 0) {
                toast.success("Thêm sản phẩm thành công!");
                props.onClose();
            } else {
                toast.error(data.EM);
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi thêm sản phẩm!");
        }
    };
    

    if (!props.modalProduct) return null;

    return (
        <>
            <div className={cx('overlay')}
            // onClick={handleOverlayClick}
            >
                <div className={cx('wrapper')}>
                    <div className={cx('content')}><h2>Thêm sản phẩm</h2>
                        <div className={cx('name')}>
                            <span>Tên sản phẩm: </span>
                            <input 
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className={cx('os')}>
                            <span>Hệ điều hành: </span>
                            <input 
                                type='text'
                                value={os}
                                onChange={(e) => setOs(e.target.value)}
                            />
                        </div>
                        <div className={cx('image')}>
                            <span>Thêm ảnh: </span>
                            <input type="file" onChange={handleChangeImage} accept="image/*"
                            name='image-product'
                            />
                        </div>
                        <div className={cx('description')}>
                            <span>Mô tả: </span>
                            <input
                                type='text'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className={cx('ram-rom')}>
                            <span>Ram: </span>
                            <input
                                type='text'
                                value={ram}
                                onChange={(e) => setRam(e.target.value)}
                            />
                            <span>Rom: </span>
                            <input 
                                type='text'
                                value={rom}
                                onChange={(e) => setRom(e.target.value)}
                            />
                        </div>
                        <div className={cx('inch')}>
                            <span>Inch: </span>
                            <input
                                type='text'
                                value={inch}
                                onChange={(e) => setInch(e.target.value)}
                            />
                        </div>
                        <div className={cx('brand')}>
                            <span>Nhãn hiệu: </span>
                            <input
                                type='text'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </div>
                        <div className={cx('country')}>
                            <span>Nước sản xuất: </span>
                            <input
                                type='text'
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        <div className={cx('price')}>
                            <span>Giá: </span>
                            <input
                                type='text'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <span>Phần trăm giảm: </span>
                            <input
                                type='text'
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                        </div>
                        <button className={cx('add-product-btn')} onClick={() => handleAddProduct()}>Thêm sản phẩm</button>
                    </div>
                    <button className={cx('btn-close')} onClick={props.onClose}>
                        <img
                            src="https://salt.tikicdn.com/ts/upload/fe/20/d7/6d7764292a847adcffa7251141eb4730.png"
                            alt="close"
                        />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Product