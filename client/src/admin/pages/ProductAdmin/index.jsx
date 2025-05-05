import styles from './ProductAdmin.module.scss';
import classNames from 'classnames/bind';
import SidebarAdmin from '../../components/SidebarAdmin';
import HeaderAdmin from '../../components/HeaderAdmin';

const cx = classNames.bind(styles);

const ProductAdmin = () => {

    return (
        <>
            <HeaderAdmin />
            <div className={cx('wrapper')}>
                <SidebarAdmin />
                <div>
                    <div>Admin page</div>
                </div>
            </div>
        </>
    )
}

export default ProductAdmin