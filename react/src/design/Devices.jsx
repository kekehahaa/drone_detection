import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    SearchOutlined, DatabaseOutlined, VideoCameraOutlined, BarChartOutlined,
    InboxOutlined, OrderedListOutlined, UnorderedListOutlined, StopOutlined,
    AlignLeftOutlined, RiseOutlined, FallOutlined, PlusOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Input, Button, Dropdown, Space } from 'antd';

import DevicesList from '../design/DevicesList.jsx'

// разделяет старницу на голову, основную часть, нижнюю, и боковую
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

const sortButtonItems = [
    {
        key: 'sortById',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                <Space>
                    <OrderedListOutlined />
                    ID
                </Space>
            </a>
        ),
    },
    {
        key: 'sortByName',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                <Space>
                    <UnorderedListOutlined />
                    Название
                </Space>
            </a>
        ),
    },
    {
        key: 'remove',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                <Space>
                    <StopOutlined />
                    Сбросить
                </Space>
            </a>
        ),
    },
];

const filterButtonItems = [
    {
        key: 'filterUp',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                <Space>
                    <RiseOutlined />
                    По возрастанию
                </Space>
            </a>
        ),
    },
    {
        key: 'filterDown',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                <Space>
                    <FallOutlined />
                    По убыванию
                </Space>
            </a>
        ),
    },
    {
        key: 'remove',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                <Space>
                    <StopOutlined />
                    Сбросить
                </Space>
            </a>
        ),
    },
];

// для кнопок бокового меню, их настройки
const menuButtonItems = [
    getItemMenu('Устройства', 'device', <VideoCameraOutlined />),
    getItemMenu('Уведомления', 'notification', <InboxOutlined />),
    getItemMenu('Логи', 'log', <DatabaseOutlined />),
    getItemMenu('Статистика', 'statistic', <BarChartOutlined />),
];

const Devices = () => {
    const navigate = useNavigate();

    const handleMenuclick = (e) => {
        switch (e.key) {

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

    const addButtonItems = [
        {
            key: 'addButton',
            label: (
                <span onClick={() => navigate('/devices/create')}>
                    <Space style={{ cursor: 'pointer' }}>
                        <PlusCircleOutlined />
                        Добавить устройство
                    </Space>
                </span>
            ),
        },
    ]
    // состояние панели боковой свернута ли или нет
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG }, // цвет фона контейнеров antd
    } = theme.useToken();

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
                    defaultSelectedKeys={['device']} // это что по умолчанию в меню будет выбрано, подсвечено синим
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
                        <Input // поле ввода
                            placeholder="Поиск" // фоновый текст, пропадет при вводе
                            prefix={<SearchOutlined />} // иконка поиска в строке записи
                            style={{ width: 250 }} // ширина
                        />
                        <Button type="primary" style={{ width: 45 }}  /* кнопка у поиска*/
                            icon={<SearchOutlined /> /* иконка поиска*/}>
                        </Button>
                        <Space style={{ width: 50, marginLeft: 50 }} direction="vertical">
                            <Space wrap>
                                <Dropdown menu={{ items: sortButtonItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                                    <Button icon={<OrderedListOutlined />}>Сортировка</Button>
                                </Dropdown>
                            </Space>
                        </Space>
                        <Space style={{ width: 50, marginLeft: 100 }} direction="vertical">
                            <Space wrap>
                                <Dropdown menu={{ items: filterButtonItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                                    <Button icon={<AlignLeftOutlined />}>Фильтр</Button>
                                </Dropdown>
                            </Space>
                        </Space>
                        <Space style={{ width: 50, marginLeft: 70 }} direction="vertical">
                            <Space wrap>
                                <Dropdown menu={{ items: addButtonItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                                    <Button type="primary" style={{ width: 45 }}  /* кнопка у поиска*/
                                        icon={<PlusOutlined /> /* иконка поиска*/}>
                                    </Button>
                                </Dropdown>
                            </Space>
                        </Space>
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
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                        <h2>Доступно устройств: </h2>
                        <DevicesList />
                    </div>

                </Content>

                <Footer style={{ // нижнаяя панель страницы
                    textAlign: 'center',
                    padding: '16px 0'
                }}>
                    Drone Detection ©{new Date().getFullYear()} Created by MIREA student
                </Footer>
            </Layout>
        </Layout >
    );
};

export default Devices;