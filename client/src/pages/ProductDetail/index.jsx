import Header from "../../components/Header"
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';

const cx = classNames.bind(styles);

const ProductDetail = () => {
    return (
        <>
            <Header />
            <div className={cx('main')}>
                <div className={cx('wrapper')}>
                    <div className={cx('title')}>Điện thoại Realme51</div>
                    <div className={cx("container")}>
                        <div className={cx("container-content")}>
                            <div className={cx("image")}>
                                <img src="https://cdn.tgdd.vn/Products/Images/42/332236/Slider/realme-c75-8gb-512gb638708891479476030.jpg"/>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div>
                                <span>Cấu hình & bộ nhớ</span>
                                <div>Hệ điều hành:</div>
                                <div>Chip xử lý (CPU):</div>
                                <div>Tốc độ CPU</div>
                                <div>Chip đồ họa (GPU):</div>
                                <div>RAM:</div>
                                <div>Dung lượng lưu trữ:</div>
                                <div>Dung lượng còn lại (khả dụng) khoảng:</div>
                                <div>Thẻ nhớ:</div>
                                <div>Danh bạ:</div>
                                <div>Tốc độ CPU</div>
                                <div>Chip đồ họa (GPU):</div>
                                <div>RAM:</div>
                                <div>Dung lượng lưu trữ:</div>
                                <div>Dung lượng còn lại (khả dụng) khoảng:</div>
                                <div>Thẻ nhớ:</div>
                                <div>Danh bạ:</div>
                                <div>Tốc độ CPU</div>
                                <div>Chip đồ họa (GPU):</div>
                                <div>RAM:</div>
                                <div>Dung lượng lưu trữ:</div>
                                <div>Dung lượng còn lại (khả dụng) khoảng:</div>
                                <div>Thẻ nhớ:</div>
                                <div>Danh bạ:</div>
                            </div>
                        </div>
                        <div className={cx("container-content")}>
                            <div>
                                <span>Camera & Màn hình</span>
                                <div>Độ phân giải camera sau:</div>
                                <div>Quay phim camera sau:</div>
                                <div>Đèn Flash camera sau:</div>
                                <div>Tính năng camera sau:</div>
                                <div>Độ phân giải camera trước:</div>
                                <div>Tính năng camera trước:</div>
                                <div>Công nghệ màn hình:</div>
                                <div>Độ phân giải màn hình:</div>
                                <div>Màn hình rộng:</div>
                                <div>Độ sáng tối đa:</div>
                                <div>Mặt kính cảm ứng:</div>
                            </div>
                        </div>
                        
                        <div className={cx("container-content")}>
                            <div>Đánh giá khách hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail;