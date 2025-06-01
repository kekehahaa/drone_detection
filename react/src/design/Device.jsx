import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    DatabaseOutlined, VideoCameraOutlined, BarChartOutlined, InboxOutlined,
    EditOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Card, Switch, Space, Tabs } from 'antd';
import axios from 'axios';

// разделяет старницу на голову, основную часть, нижнюю, и боковую
const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card

// создает компанент меню
function getItemMenu(label, key, icon, children) {
    return {
        key, // id
        icon, // иконка из ant design
        children, // подменю если есть
        label, // название
    };
}

const onChangeButtonTabs = key => {
    console.log(key);
};

const itemsButtonTabs = [
    {
        key: 'logs',
        label: 'Логи',
        children: 'Content of Tab Pane 1',
    },
    {
        key: 'videostream',
        label: 'Видеопоток',
        children: 'Content of Tab Pane 2',
    },
]

// для кнопок бокового меню, их настройки
const menuButtonItems = [
    getItemMenu('Устройства', 'device', <VideoCameraOutlined />),
    getItemMenu('Уведомления', 'notification', <InboxOutlined />),
    getItemMenu('Логи', 'log', <DatabaseOutlined />),
    getItemMenu('Статистика', 'statistic', <BarChartOutlined />),
];

const Devices = () => {
    const [activeTab, setActiveTab] = useState('logs');


    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { deviceId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevice = async () => {
            try {
                const response = await axios.get(`http://localhost:8200/devices/${deviceId}`);
                setDevice(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDevice();
    }, [deviceId]);

    const handleMenuclick = (e) => {
        switch (e.key) {
            case 'device':
                navigate('/devices')
                break;
            case 'notification':
                navigate('/notifications');
                break;
            case 'log':
                navigate('/logs');
                break;
            case 'statistic':
                navigate('/statistics');
                break;
            default:
                break;
        }
    };

    const onChangeButtonTabs = (key) => {
        setActiveTab(key);
        console.log(key);
    };

const itemsButtonTabs = [
  {
    key: 'logs',
    label: 'Логи',
    children: 'Content of Tab Pane 1',
  },
  {
    key: 'videostream',
    label: 'Видеопоток',
    children: (
      <div style={{ textAlign: 'center' }}>
        <img
          src={`http://localhost:8200/devices/${deviceId}/detection/video`}
          alt="Video stream"
          style={{
            maxWidth: '100%',
            maxHeight: '500px',
            backgroundColor: '#000',
          }}
        />
      </div>
    ),
  },
];

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG }, // цвет фона контейнеров antd
    } = theme.useToken();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        // верстка на всем браузере
        <Layout style={{ minHeight: '100vh' }}>
            <Sider // боковая панель
                collapsible // сворачиваемая
                collapsed={collapsed} // управлет состоянием
                onCollapse={value => setCollapsed(value)} // функция которая вызывается при клике на иконку сворачивания
                style={{
                    overflow: 'auto', // позволяет прокручивать если выходит за пределы страницы
                    height: '100vh', // высота во весь экран
                    position: 'fixed', // фиксировано, то есть будет вместе с прокруткой страницы двигаться
                    left: 0, // находится слева
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu // компонент меню
                    theme="dark" // темная тема
                    defaultSelectedKeys={[]} // это что по умолчанию в меню будет выбрано, подсвечено синим
                    mode="inline" // вертикальное меню
                    onClick={handleMenuclick}
                    items={menuButtonItems} // пункты меню которые ранее созданы в переменной
                />
            </Sider>
            <Layout style={{ // верстка справа от панели
                marginLeft: collapsed ? 80 : 200, // сдвигает верстку вправа от панели, взависимости свернута ли она
                transition: 'margin 0.3s' // анимация при сворачивании панели, сдвигает все что было правее влево
            }}>
                <Header style={{ // он пуст
                    padding: 0, // сдвиг
                    background: colorBgContainer, // фон
                    height: 0 // не занимает места
                }} />

                <Content style={{ // основной слой странциы
                    margin: 0, // сдвигает со всех сторон на колво пикселей
                    padding: '0 16px' // сдвигает от панели слева
                }}>
                    <div style={{
                        padding: '10px 0'
                    }}>

                    </div>
                    <div
                        style={{
                            padding: 0, // сдвиг
                            minHeight: 0,
                            background: colorBgContainer, // фон
                            borderRadius: borderRadiusLG, // радиус
                        }}
                    >
                    </div>
                    <div
                        style={{
                            padding: 0,
                            minHeight: 300,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>

                        <Card>
                            <h2>
                                {device.name}
                                <EditOutlined style={{ marginLeft: '8px', cursor: 'pointer', color: '#0000FF' }} />
                            </h2>

                            <div style={{ display: 'flex' }}>
                                <img
                                    alt="example"
                                    src="/images-2.jpeg"
                                    style={{ width: 200, marginLeft: '30px', marginRight: '20px' }}
                                />

                                <div>
                                    <p style={{ color: '#adadad' }}>Идентификатор #{device.id} создан пользователем </p>
                                    <p
                                        style={{ color: '#adadad' }}>Описание: {device.description}
                                        <EditOutlined style={{ marginLeft: '8px', cursor: 'pointer', color: '#0000FF' }} />
                                    </p>
                                    <div style={{ marginTop: 8 }}>
                                        <Space direction="horizontal" style={{ color: '#adadad' }}>
                                            Детекция БПЛА
                                            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" defaultChecked={false} />
                                        </Space>
                                    </div>

                                    <div style={{ marginTop: 8 }}>
                                        <Space direction="horizontal" style={{ color: '#adadad' }}>
                                            Показывать детекцию на видео
                                            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" defaultChecked={false} />
                                        </Space>
                                    </div>
                                </div>
                            </div>
                            <Tabs style={{ marginLeft: 30 }} defaultActiveKey="logs" items={itemsButtonTabs} onChange={onChangeButtonTabs} />
                        </Card>

                    </div>

                </Content>


                <Footer style={{ // нижнаяя панель страницы
                    textAlign: 'center',
                    padding: '0px 0'
                }}>
                    Drone Detection ©{new Date().getFullYear()} Created by MIREA student
                </Footer>
            </Layout>
        </Layout >
    );
};

export default Devices;