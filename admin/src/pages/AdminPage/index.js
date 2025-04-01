import React, {useState} from 'react';
import {Button, Form, Layout, Menu, Popconfirm, Table} from 'antd';
import {
    AppstoreOutlined,
    DatabaseOutlined,
    BulbOutlined,
    SettingOutlined,
    SkinOutlined,
    UserOutlined,
    QuestionOutlined,
    LogoutOutlined,
    SyncOutlined
} from '@ant-design/icons';
import ApplicationPage  from "../../components/ApplicationPage";
import IndexPage   from "../../components/IndexPage";
import PromptsPage from "../../components/PromptsPage";
import HelpPage from "../../components/HelpPage";
import AppearancePage from "../../components/AppearancePage";
import IndexTeacherPage from "../../components/IndexTeacherPage";
import {useNavigate} from "react-router-dom";
import SettingPage  from "../../components/SettingPage";
import UserManagePage from "../../components/UserManagePage";
import RebuildAndRestartButton from '../../components/RebuildAndRestartButton';

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('1');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleAdd = () => {
        setCurrentRecord(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setCurrentRecord(record);
        setIsModalVisible(true);
        form.setFieldsValue(record);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleLogout = () => {
        // 这里假设你使用localStorage来存储认证信息
        localStorage.removeItem('userToken'); // 假设你的token存储在'userToken'键下
        // 重定向到登录页面
        // window.location.href = '/login';
        navigate('/'); // 登录成功后跳转)
    };


    const dataSource = [
        { id: 'a', content: 'Item 1' },
        { id: 'b', content: 'Item 2' },
        { id: 'c', content: 'Item 3' },
    ];
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/*<Header className="header" style={{ color: 'white', fontSize: '20px' }}>*/}
            {/*    BISTU Copilot 后台管理*/}
            {/*</Header>*/}
            <Header className="header" style={{ color: 'white', fontSize: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>BISTU Copilot 后台管理</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Rebuild and Restart Button with Icon */}
        <RebuildAndRestartButton style={{ marginRight: '10px' }} icon={<SyncOutlined />} />
        <Popconfirm
            title="你确定要退出登录吗？"
            onConfirm={handleLogout}
            okText="是"
            cancelText="否"
        >
            <LogoutOutlined style={{ fontSize: '20px', color: 'white', cursor: 'pointer', marginLeft: '20px' }} /> 退 出
        </Popconfirm>
      </div>
    </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        // defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        onSelect={({ key }) => setSelectedMenu(key)}
                    >
                        <Menu.Item key="1" icon={<AppstoreOutlined />}>应用管理</Menu.Item>
                        <Menu.Item key="2" icon={<DatabaseOutlined />}>学生目录管理</Menu.Item>
                        <Menu.Item key="3" icon={<DatabaseOutlined />}>老师目录管理</Menu.Item>
                        <Menu.Item key="4" icon={<BulbOutlined />}>提示词管理</Menu.Item>
                        <Menu.Item key="5" icon={<SettingOutlined />}>配置</Menu.Item>
                        <Menu.Item key="6" icon={<SkinOutlined />}>外观</Menu.Item>
                        <Menu.Item key="7" icon={<UserOutlined />}>用户管理</Menu.Item>
                        <Menu.Item key="8" icon={<QuestionOutlined />}>帮助管理</Menu.Item>
                        {/*<Menu.Item key="8" icon={<LogoutOutlined />} onClick={handleLogout}>退出登录</Menu.Item>*/}
                    </Menu>
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            backgroundColor: 'white',
                        }}
                    >
                        {/* Content goes here */}
                        {/*选择一个栏目以开始管理*/}
                        {/*//TODO 不同的栏目用不同的内容*/}
                        {selectedMenu === '1' && <ApplicationPage />}
                        {selectedMenu === '2' && <IndexPage />}
                        {selectedMenu === '3' && <IndexTeacherPage />}
                        {selectedMenu === '4' && <PromptsPage />}
                        {selectedMenu === '5' && <SettingPage />}
                        {selectedMenu === '6' && <AppearancePage />}
                        {selectedMenu === '7' && <UserManagePage/>}
                        {selectedMenu === '8' && <HelpPage />}

                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminPage;