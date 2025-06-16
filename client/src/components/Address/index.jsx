import { Modal, Button, Radio, Select, Input } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const { Option } = Select;

const AddressModal = ({
    isModalOpen,
    setIsModalOpen,
    addresses,
    setAddresses,
    selectedAddress,
    setSelectedAddress,
    setCurrentAddress,
    onNewAddressAdded,
}) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newAddress, setNewAddress] = useState({
        tenDiaChi: '',
        tinhThanh: '',
        quanHuyen: '',
        phuongXa: '',
        diaChiChiTiet: ''
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (isModalOpen && addresses.length > 0 && !selectedAddress) {
            const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
            setSelectedAddress(defaultAddr?.maDiaChi);
        }
    }, [isModalOpen, addresses]);

    const handleProvinceChange = async (value) => {
        const selected = provinces.find(p => p.code === value);
        setNewAddress(prev => ({ ...prev, tinhThanh: selected?.name || '', quanHuyen: '', phuongXa: '' }));
        setDistricts([]);
        setWards([]);
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/p/${value}?depth=2`);
            setDistricts(res.data.districts);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDistrictChange = async (value) => {
        const selected = districts.find(d => d.code === value);
        setNewAddress(prev => ({ ...prev, quanHuyen: selected?.name || '', phuongXa: '' }));
        setWards([]);
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/d/${value}?depth=2`);
            setWards(res.data.wards);
        } catch (err) {
            console.error(err);
        }
    };

    const handleWardChange = (value) => {
        const selected = wards.find(w => w.code === value);
        setNewAddress(prev => ({ ...prev, phuongXa: selected?.name || '' }));
    };

    useEffect(() => {
        if (isAddingNew) {
            axios.get('https://provinces.open-api.vn/api/?depth=1')
                .then(res => setProvinces(res.data))
                .catch(err => console.error(err));
        }
    }, [isAddingNew]);

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsAddingNew(false);
    };

    const handleConfirm = () => {
        const selected = addresses.find(addr => addr.maDiaChi === selectedAddress);
        console.log("===> Địa chỉ được chọn:", selected);
        if (selected) setCurrentAddress(selected);
        setIsModalOpen(false);
    };

    const handleSaveNewAddress = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.post('http://localhost:8080/api/v1/address', newAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const newAddr = res.data;
            toast.success("Thêm địa chỉ mới thành công!");

            await onNewAddressAdded?.(newAddr);

            setSelectedAddress(newAddr.maDiaChi);
            console.log(newAddr)
            setCurrentAddress(newAddr.DT);

            setNewAddress({
                tenDiaChi: '',
                tinhThanh: '',
                quanHuyen: '',
                phuongXa: '',
                diaChiChiTiet: ''
            });
            setIsAddingNew(false);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi lưu địa chỉ mới:', err);
        }
    };

    return (
        <Modal
            title="Địa Chỉ Của Tôi"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>Hủy</Button>,
                <Button key="ok" type="primary" onClick={handleConfirm}>Xác nhận</Button>
            ]}
        >
            <Radio.Group
                onChange={(e) => setSelectedAddress(e.target.value)}
                value={selectedAddress}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
                {addresses.map(addr => (
                    <Radio value={addr.maDiaChi} key={addr.maDiaChi}>
                        <div>
                            <strong>{addr.tenDiaChi || 'Địa chỉ'}</strong><br />
                            {addr.diaChiChiTiet}, {addr.phuongXa}, {addr.quanHuyen}, {addr.tinhThanh}<br />
                            {addr.isDefault && <span style={{ color: 'red' }}>Mặc định</span>}
                        </div>
                    </Radio>
                ))}
            </Radio.Group>

            {isAddingNew ? (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Select
                        placeholder="Tên địa chỉ"
                        value={newAddress.tenDiaChi}
                        onChange={(value) => setNewAddress(prev => ({ ...prev, tenDiaChi: value }))}
                    >
                        <Option value="Nhà riêng">Nhà riêng</Option>
                        <Option value="Văn phòng">Văn phòng</Option>
                    </Select>

                    <Select
                        placeholder="Tỉnh / Thành phố"
                        value={provinces.find(p => p.name === newAddress.tinhThanh)?.code || undefined}
                        onChange={handleProvinceChange}
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {provinces.map(p => (
                            <Option key={p.code} value={p.code}>{p.name}</Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Quận / Huyện"
                        value={districts.find(d => d.name === newAddress.quanHuyen)?.code || undefined}
                        onChange={handleDistrictChange}
                        disabled={!districts.length}
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {districts.map(d => (
                            <Option key={d.code} value={d.code}>{d.name}</Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Phường / Xã"
                        value={wards.find(w => w.name === newAddress.phuongXa)?.code || undefined}
                        onChange={handleWardChange}
                        disabled={!wards.length}
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {wards.map(w => (
                            <Option key={w.code} value={w.code}>{w.name}</Option>
                        ))}
                    </Select>

                    <Input.TextArea
                        placeholder="Địa chỉ chi tiết"
                        value={newAddress.diaChiChiTiet}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, diaChiChiTiet: e.target.value }))}
                        rows={2}
                    />

                    <Button
                        type="dashed"
                        onClick={handleSaveNewAddress}
                        disabled={
                            !newAddress.tenDiaChi ||
                            !newAddress.tinhThanh ||
                            !newAddress.quanHuyen ||
                            !newAddress.phuongXa ||
                            !newAddress.diaChiChiTiet
                        }
                    >
                        Lưu và sử dụng
                    </Button>
                </div>
            ) : (
                <Button
                    type="dashed"
                    style={{ marginTop: 16 }}
                    onClick={() => setIsAddingNew(true)}
                >
                    + Thêm Địa Chỉ Mới
                </Button>
            )}
        </Modal>
    );
};

export default AddressModal;
