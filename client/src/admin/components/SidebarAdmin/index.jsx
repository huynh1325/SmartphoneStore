import styles from './SidebarAdmin.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SidebarAdmin = () => {

    return (
        <>
        <div className={cx("sidebar")}>
            <div>Tài khoản</div>
            <div>Sản phẩm</div>
        </div>
        </>
    )
}

export default SidebarAdmin