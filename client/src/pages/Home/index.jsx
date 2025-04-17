import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Header from '../../components/Header';

const cx = classNames.bind(styles);

const Home = () => {
    return (
        <div
        //  className={cx('main')}
        >
            < Header />
        </div>
    )
}

export default Home;