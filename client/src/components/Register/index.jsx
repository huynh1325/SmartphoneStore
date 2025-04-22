import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

const Register = (props) => {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [gender, setGender] = useState('');
    
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
          .then(res => res.json())
          .then(data => setProvinces(data));
      }, []);

    useEffect(() => {
    if (!selectedProvince) return;

    fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then(res => res.json())
        .then(data => {
        setDistricts(data.districts);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
        });
    }, [selectedProvince]);

    useEffect(() => {
        if (!selectedDistrict) return;
    
        fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
          .then(res => res.json())
          .then(data => {
            setWards(data.wards);
            setSelectedWard('');
          });
    }, [selectedDistrict]);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Tỉnh: ${selectedProvince}, Huyện: ${selectedDistrict}, Xã: ${selectedWard}`);
    };
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            props.onClose();
        }
    };

    if (!props.modalRegister) return null;

    return (
        <div className={cx('overlay')} onClick={handleOverlayClick}>
            <div className={cx('wrapper')}>
                <div className={cx('register')}>
                    <div className={cx('heading')}>
                        <h4>Đăng ký</h4>
                    </div>
                    <div className={cx('input')}>
                        <div className={cx('form-group-radio')}>
                            <input placeholder="Họ và tên" type="text" className={cx('register-input')} />
                            <input
                                className={cx('genderMale')}
                                type="radio"
                                name="gender"
                                value="Nam"
                                id="genderMale"
                                checked={gender === 'Nam'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label htmlFor="genderMale">Nam</label>
                            <input
                                type="radio"
                                value="Nữ"
                                id="genderFemale"
                                checked={gender === 'Nữ'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <label htmlFor="genderFemale">Nữ</label>
                        </div>
                        <div className={cx('form-group')}>
                            <input placeholder="Email" type="text" className={cx('register-input')} />
                            <input placeholder="Số điện thoại" type="text" className={cx('register-input')} />
                        </div>
                        <div className={cx('form-group-select')}>
                            <div className={cx('select-form')}>
                                <label className={cx('select-form-label')}>Tỉnh / Thành phố</label>
                                <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} required>
                                <option value="">Chọn tỉnh/thành</option>
                                    {provinces.map(p => (
                                        <option key={p.code} value={p.code}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={cx('select-form')}>
                                <label className={cx('select-form-label')}>Quận / Huyện</label>
                                <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} required>
                                <option value="">Chọn quận/huyện</option>
                                    {districts.map(d => (
                                        <option key={d.code} value={d.code}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={cx('form-group')}>
                            <div className={cx('select-form')}>
                                <label className={cx('select-form-label')}>Xã / Phường</label>
                                <select value={selectedWard} onChange={e => setSelectedWard(e.target.value)} required>
                                <option value="">Chọn xã/phường</option>
                                    {wards.map(w => (
                                        <option key={w.code} value={w.code}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            <input placeholder="Tên đường" type="text" className={cx('register-input')} />
                        </div>
                        <div className={cx('form-group')}>
                            <input placeholder="Mật khẩu" type="password" className={cx('register-input')} />
                            <input placeholder="Xác nhận mật khẩu" type="password" className={cx('register-input')} />
                        </div>
                    </div>
                    <button type='Submit' className={cx('register-btn')}>Tiếp tục</button>
                    <span className={cx('login-redirect')}>Bạn đã có tài khoản? <a>Đăng nhập</a> ngay!</span>
                </div>
                <div className={cx('register-img')}>
                    <img
                        src="https://salt.tikicdn.com/ts/upload/eb/f3/a3/25b2ccba8f33a5157f161b6a50f64a60.png"
                        alt="img"
                    />
                </div>
                <button className={cx('btn-close')} onClick={props.onClose}>
                    <img
                        src="https://salt.tikicdn.com/ts/upload/fe/20/d7/6d7764292a847adcffa7251141eb4730.png"
                        alt="close"
                    />
                </button>
            </div>
        </div>
    )
}

export default Register;