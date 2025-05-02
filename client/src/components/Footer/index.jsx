import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <>
            <div className={cx("content")}>
                <p>© 2025. Công ty trách nhiệm hữu hạn một thành viên HHH</p>
            </div>
        </>
    )
}

export default Footer;