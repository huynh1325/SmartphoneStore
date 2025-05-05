import styles from './Admin.module.scss';
import classNames from 'classnames/bind';
import SidebarAdmin from './components/SidebarAdmin';
import HeaderAdmin from './components/HeaderAdmin';

const cx = classNames.bind(styles);

const Admin = () => {

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

export default Admin