import classNames from 'classnames/bind';
import styles from './AllOrders.module.scss';

const cx = classNames.bind(styles);

const AllOrders = () => {
    return (
        <div className={cx('order-wrapper')}>
            <div className={cx('order-header')}>
                <span className={cx('order-id')}>Đơn hàng: <strong>#02059SH23030289793</strong></span>
                <span className={cx('order-status')}>Đã nhận hàng</span>
            </div>

            <div className={cx('order-body')}>
                <div className={cx('product-info')}>
                    <img
                        src="https://cdn.tgdd.vn/Products/Images/86/252625/chuot-khong-day-rapoo-m216-den-thumb4-400x400.jpeg"
                        alt="ảnh sản phẩm"
                        className={cx('product-image')}
                    />
                    <div className={cx('product-name')}>Chuột Không Dây Rapoo M216 Đen</div>
                </div>

                <div className={cx('order-summary')}>
                    <div className={cx('total-price')}>Tổng tiền: <strong>200.000₫</strong></div>
                    <button className={cx('detail-btn')}>Xem chi tiết</button>
                </div>
            </div>
        </div>
    )
}

export default AllOrders