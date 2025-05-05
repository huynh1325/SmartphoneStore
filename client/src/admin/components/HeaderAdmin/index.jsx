import styles from './HeaderAdmin.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const HeaderAdmin = () => {

    return (
        <>
            <div className={cx("header")}>
                <div className={cx("logo")}>Admin</div>
            </div>
        </>
    )
}

export default HeaderAdmin