import { useState } from 'react';
import {
    Button, Popconfirm, Space, Upload,
    Breadcrumb, Layout, Menu, theme, Card,
} from 'antd';

import {
    UploadOutlined,
    DatabaseOutlined,
    VideoCameraOutlined,
    BarChartOutlined,
    InboxOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Устройства', '1', <VideoCameraOutlined />,),
    getItem('Уведомления', '2', <InboxOutlined />),
    getItem('Логи', '3', <DatabaseOutlined />),
    getItem('Статистика', '4', <BarChartOutlined />),
];

const App = ({ device }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                />
            </Sider>

            <Layout style={{
                marginLeft: collapsed ? 80 : 200,
                transition: 'margin 0.2s'
            }}>
                <Header style={{
                    padding: 0,
                    background: colorBgContainer,
                    height: 0
                }} />

                <Content style={{
                    margin: 0,
                    padding: '0 16px'
                }}>
                    <Breadcrumb style={{
                        margin: '16px 0',
                        paddingTop: 16
                    }}>
                        <Breadcrumb.Item></Breadcrumb.Item>

                    </Breadcrumb>
                    <div
                        style={{
                            padding: 5,
                            minHeight: 0,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div>

                            <Space>
                                <Card title="Card" size="small">
                                    <p>Card content</p>
                                    <p>Card content</p>
                                </Card>
                            </Space>
                        </div>
                    </div>
                    <div
                        style={{
                            padding: 5,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                    </div>
                </Content>

                <Footer style={{
                    textAlign: 'center',
                    padding: '16px 0'
                }}>
                    Drone Detection ©{new Date().getFullYear()} Created by MIREA student
                </Footer>
            </Layout>
        </Layout >
    );
};

export default App;