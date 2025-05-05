import styles from './UserAdmin.module.scss';
import classNames from 'classnames/bind';
import SidebarAdmin from '../../components/SidebarAdmin';
import HeaderAdmin from '../../components/HeaderAdmin';

const cx = classNames.bind(styles);

const UserAdmin = () => {

    return (
        <>
            <HeaderAdmin />
            <div className={cx('wrapper')}>
                <SidebarAdmin />
                <div className={cx('content')}>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Họ tên</th>
                                <th>Tuổi</th>
                                <th>Thành phố</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nguyễn Văn A</td>
                                <td>25</td>
                                <td>Hà Nội</td>
                            </tr>
                            <tr>
                                <td>Trần Thị B</td>
                                <td>30</td>
                                <td>Đà Nẵng</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default UserAdmin