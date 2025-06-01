import { DeleteOutlined, SettingOutlined, WifiOutlined } from '@ant-design/icons';
import { Card, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Meta } = Card; //  компонент внутри карточки, используется для отображения avatar, title, и description.

const CameraCard = ({ device, onDelete }) => { // принимает словарь device, то есть устройство
    const navigate = useNavigate(); // используется для навигации

    const handleSettingsClick = (e) => {
        e.stopPropagation(); // чтобы не сработал onClick всей карточки
        navigate(`/devices/${device.id}/edit`); // переход по маршруту
    };

    const handleCardClick = () => {
        navigate(`/devices/${device.id}`); // Переход при клике на всю карточку
    };

    const handleDelete = async (deviceId) => {
        try {
            await axios.get(`http://localhost:8200/devices/delete/${deviceId}`);
            message.success("Устройство удалено");

            // 💡 Уведомляем родителя
            onDelete(deviceId);
        } catch (err) {
            console.error(err);
            message.error("Не удалось удалить устройство");
        }
    };

    return (
        <Card // контейнер
            style={{
                width: 280, // ширина
                // указать при наведении будто кликабельный
            }}
            cover={ // верхняя часть карточки
                <img // в ней только изображение
                    style={{ cursor: 'pointer' }}
                    alt="example"
                    src="/images-2.jpeg"
                    onClick={handleCardClick}
                />

            }
            actions={[ //
                <SettingOutlined key="setting" onClick={handleSettingsClick} />,
                <Popconfirm
                    key="remove"
                    title="Удалить устройство?"
                    description="Вы уверены, что хотите удалить это устройство?"
                    onConfirm={() => handleDelete(device.id)}
                    okText="Да"
                    cancelText="Отмена"
                    onClick={e => e.stopPropagation()} // не срабатывает клик карточки
                >
                    <DeleteOutlined key="remove" onClick={e => e.stopPropagation()} />
                </Popconfirm>,
            ]}>
            <div style={{
                position: 'absolute',
                top: 10,
                left: 0,
                backgroundColor: 'rgba(160, 159, 159, 0.5)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '5px',
                zIndex: 1
            }}>
                {
                    `id: ${device.id}` // идентификатор устройства
                }
            </div>
            <Meta
                avatar={<WifiOutlined />} // иконка
                title={device.name} // отображение названия устройства
                description={device.description} // описание устройства
            />
        </Card>
    );
};

export default CameraCard;

