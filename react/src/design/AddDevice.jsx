// src/pages/CreateDevice.jsx
import { useState } from 'react';
import { Card, Form, Input, Button, message, Space, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    DatabaseOutlined, VideoCameraOutlined, BarChartOutlined, InboxOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;

// создает компанент меню
function getItemMenu(label, key, icon, children) {
    return {
        key, // id
        icon, // иконка из ant design
        children, // подменю если есть
        label, // название
    };
}

// для кнопок бокового меню, их настройки
const menuButtonItems = [
    getItemMenu('Устройства', 'device', <VideoCameraOutlined />),
    getItemMenu('Уведомления', 'notification', <InboxOutlined />),
    getItemMenu('Логи', 'log', <DatabaseOutlined />),
    getItemMenu('Статистика', 'statistic', <BarChartOutlined />),
];

export default function CreateDevice() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleMenuclick = (e) => {
        switch (e.key) {
            case 'device':
                navigate('/devices');
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

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG }, // цвет фона контейнеров antd
    } = theme.useToken();

    const onFinish = async (values) => {
        if (!('description' in values)) {
            values.description = ""; // обязательно добавляем поле, пусть даже пустое
        }
        await axios.post('http://localhost:8200/devices/add', values);
        message.success('Создано');
        navigate('/');
    };

    return (
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
                    onClick={handleMenuclick}
                    defaultSelectedKeys={[]} // это что по умолчанию в меню будет выбрано, подсвечено синим
                    mode="inline" // вертикальное меню
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
                    <Card title="Добавить новое устройство" style={{ maxWidth: 600, margin: '40px auto' }}>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item name="name" label="Название" rules={[{ required: true }]}>
                                <Input placeholder="Складской двор" />
                            </Form.Item>
                            <Form.Item name="ip_address" label="Адрес устройства" rules={[{ required: true }]}>
                                <Input placeholder="rtsp://username:password@192.168.1.100:554/stream1" />
                            </Form.Item>
                            <Form.Item name="description" label="Описание">
                                <Input.TextArea placeholder="Снимает небо на складском дворе" />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit">Сохранить</Button>
                                    <Button onClick={() => navigate(-1)}>Отмена</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Content>
                <Footer style={{ // нижнаяя панель страницы
                    textAlign: 'center',
                    padding: '16px 0'
                }}>
                    Drone Detection ©{new Date().getFullYear()} Created by MIREA student
                </Footer>
            </Layout>
        </Layout>

    );
}
