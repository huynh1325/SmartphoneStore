import classNames from 'classnames/bind';
import styles from './Purchase.module.scss';
import Header from "../../components/Header";
import Footer from "../../components/Footer"
import { useState, useEffect } from 'react';
import AllOrders from "../../components/AllOrders"
import PendingOrder from "../../components/PendingOrder"
import Shipping from "../../components/Shipping"
import Completed from "../../components/Completed"
import Cancelled from "../../components/Cancelled"
import ReturnRefund from "../../components/ReturnRefund"
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const tabList = [
    { label: 'Tất cả', component: <AllOrders /> },
    { label: 'Chờ xác nhận', component: <PendingOrder /> },
    { label: 'Vận chuyển', component: <Shipping /> },
    { label: 'Hoàn thành', component: <Completed /> },
    { label: 'Đã hủy', component: <Cancelled /> },
    { label: 'Trả hàng', component: <ReturnRefund /> },
];

const Purchase = () => {

    const [activeSidebar, setActiveSidebar] = useState(1);
    const [activeTab, setActiveTab] = useState(0);

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get('payment');

        if (paymentStatus === 'success') {
            toast.success('Thanh toán thành công!');
        }

    }, [location.search]);

    return (
        <>
            <Header />
            <div className={cx('main')}>
                <div className={cx('wrapper')}>
                    <div className={cx('side-bar')}>
                        {[
                            {
                                icon: 'https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4',
                                text: 'Tài khoản của tôi',
                            },
                            {
                                icon: 'https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078',
                                text: 'Đơn mua',
                            },
                            {
                                icon: 'https://down-vn.img.susercontent.com/file/84feaa363ce325071c0a66d3c9a88748',
                                text: 'Kho voucher',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={cx('element', { active: index === activeSidebar })}
                                onClick={() => setActiveSidebar(index)}
                            >
                                <img src={item.icon} alt={item.text} />
                                <div>{item.text}</div>
                            </div>
                        ))}
                        </div>
                        
                    <div className={cx('content-wrapper')}>
                        <div className={cx('content')}>
                            <div className={cx('content-header')}>
                                {tabList.map((tab, index) => (
                                    <div
                                        key={index}
                                        className={cx('tab-item', { active: activeTab === index })}
                                        onClick={() => setActiveTab(index)}
                                    >
                                        {tab.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                            
                        <div className={cx('content')}>
                            <div className={cx('tab-content')}>
                                {tabList[activeTab].component}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Purchase