import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, message,Row,Col} from 'antd';
import { API_URL } from '../../config/config'

const MainPage = () => {
    const [whiteData, setWhiteData] = useState([]);
    const [whiteDeleteId, setWhiteDeleteId] = useState(null);
    const [isWhiteDeleteModalVisible, setIsWhiteDeleteModalVisible] = useState(false);
    const [isWhiteAddModalVisible, setIsWhiteAddModalVisible] = useState(false);
    const [whiteNewRecord, setWhiteNewRecord] = useState('');

    //blacklist
    const [data, setData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newRecord, setNewRecord] = useState('');

    useEffect(() => {
        fetchWhiteData();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/blacklist`);
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const fetchWhiteData = async () => {
        try {
            const response = await fetch(`${API_URL}/whitelist`);
            const jsonData = await response.json();
            setWhiteData(jsonData);
        } catch (error) {
            console.error('Failed to fetch white data:', error);
        }
    };
    //white
    const handleWhiteDelete = (id) => {
        setWhiteDeleteId(id);
        setIsWhiteDeleteModalVisible(true);
    };

    const confirmWhiteDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/deletewhitelist/${whiteDeleteId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const newData = whiteData.filter(item => item !== whiteDeleteId);
                setWhiteData(newData);
                setIsWhiteDeleteModalVisible(false);
            } else {
                console.error('Failed to delete white data');
            }
        } catch (error) {
            console.error('Failed to delete white data:', error);
        }
    };

    const handleWhiteAdd = () => {
        setIsWhiteAddModalVisible(true);
    };

    const confirmWhiteAdd = async () => {
        try {
            const response = await fetch(`${API_URL}/addwhitelist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ record: whiteNewRecord }),
            });
            if (response.ok) {
                message.success('White record added successfully');
                fetchWhiteData();
                setIsWhiteAddModalVisible(false);
            } else {
                message.error('Failed to add white record');
            }
        } catch (error) {
            console.error('Failed to add white record:', error);
        }
    };

    const whiteColumns = [
        {
            title: '白名单',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => handleWhiteDelete(record.id)} danger>Delete</Button>
            ),
        },
    ];

    //black
    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/deleteblacklist/${deleteId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const newData = data.filter(item => item !== deleteId);
                setData(newData);
                setIsDeleteModalVisible(false);
            } else {
                console.error('Failed to delete data');
            }
        } catch (error) {
            console.error('Failed to delete data:', error);
        }
    };

    const handleAdd = () => {
        setIsAddModalVisible(true);
    };

    const confirmAdd = async () => {
        try {
            const response = await fetch(`${API_URL}/addblacklist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ record: newRecord }),
            });
            if (response.ok) {
                message.success('Record added successfully');
                fetchData();
                setIsAddModalVisible(false);
            } else {
                message.error('Failed to add record');
            }
        } catch (error) {
            console.error('Failed to add record:', error);
        }
    };

    const columns = [
        {
            title: '黑名单',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
            ),
        },
    ];

    return (
        <Row>
            <Col span={12}>
                <Button onClick={handleWhiteAdd} type="primary">添加白名单记录</Button>
                <Table dataSource={whiteData.map((item, index) => ({ id: item, key: index }))} columns={whiteColumns} rowKey="id" />
            </Col>
            <Col span={12}>
                <Button onClick={handleAdd} type="primary">添加黑名单记录</Button>
                <Table dataSource={data.map((item, index) => ({ id: item, key: index }))} columns={columns} rowKey="id" />
            </Col>
            <Modal
                title="Confirm Delete"
                visible={isWhiteDeleteModalVisible}
                onOk={confirmWhiteDelete}
                onCancel={() => setIsWhiteDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this white record?</p>
            </Modal>
            <Modal
                title="Add Record"
                visible={isWhiteAddModalVisible}
                onOk={confirmWhiteAdd}
                onCancel={() => setIsWhiteAddModalVisible(false)}
            >
                <Input placeholder="请输入要添加的白名单记录" onChange={(e) => setWhiteNewRecord(e.target.value)} />
            </Modal>
            <Modal
                title="Confirm Delete"
                visible={isDeleteModalVisible}
                onOk={confirmDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
            >
                <p>Are you sure you want to delete this black record?</p>
            </Modal>
            <Modal
                title="Add Record"
                visible={isAddModalVisible}
                onOk={confirmAdd}
                onCancel={() => setIsAddModalVisible(false)}
            >
                <Input placeholder="请输入要添加的黑名单记录" onChange={(e) => setNewRecord(e.target.value)} />
            </Modal>
        </Row>
    );
};

export default MainPage;