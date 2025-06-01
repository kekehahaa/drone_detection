import { useEffect, useState } from 'react';
import axios from 'axios';
import CameraCard from '../design/CardDevice.jsx';
import { Spin, Alert, Empty } from 'antd';

function DevicesList() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDelete = (deletedId) => {
        // при удалении передается удаленный ид, в prev -- предыдущий масисив фильтруется и обновляет массив без этой карточки
        setDevices(prev => prev.filter(device => device.id !== deletedId));
    };

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get('http://localhost:8200/devices/all');
                setDevices(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDevices();
    }, []);

    if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
    if (error) return <Alert message="Ошибка" description={error} type="error" showIcon />;
    if (!devices.length) return <Empty description="Устройства не найдены" />;

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {devices.map((device) => (
                    <CameraCard key={device.id} device={device} onDelete={handleDelete} /> // передаем в объект CameraDevice словарь device при удалении избавляемся от нее
                ))}
            </div>
        </div>
    );
}

export default DevicesList;
