import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { API_URL } from '../../config/config'
const ConfigPage = () => {
    const [configData, setConfigData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalRow4, setShowModalRow4] = useState(false);
    const [showModalRow5, setShowModalRow5] = useState(false);
    const [showModalRow6, setShowModalRow6] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/getConfigData`)
            .then(response => response.json())
            .then(data => setConfigData(data))
            .catch(error => console.error('获取配置数据失败:', error));
    }, []);

    const handleEdit = () => {
        setShowModal(true);
    };

    const handleEditRow4 = () => {
        setShowModalRow4(true);
    };

    const handleEditRow5 = () => {
        setShowModalRow5(true);
    };

    const handleEditRow6 = () => {
        setShowModalRow6(true);
    };

    const handleSave = () => {
        const newData = [...configData];
        newData.slice(0, 3).forEach((item, index) => {
            const inputElement = document.getElementById(`editContent${index}`);
            if (inputElement) {
                item.content = inputElement.value;
            }
        });

        fetch(`${API_URL}/saveConfigData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
            .then(response => {
                if (response.ok) {
                    message.success('保存成功');
                    setConfigData(newData);
                    setShowModal(false);
                } else {
                    throw new Error('保存失败');
                }
            })
            .catch(error => {
                console.error('保存配置数据失败:', error);
                message.error('保存失败');
            });
    };

    const handleCancel = () => {
        setShowModal(false);
        setShowModalRow4(false);
        setShowModalRow5(false);
        setShowModalRow6(false);
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                {configData.slice(0, 3).map((item, index) => (
                    <div key={index} style={{ marginRight: '4px' }}>
                        <span>{item.title}: {item.content}</span>
                    </div>
                ))}
                <Button onClick={handleEdit} style={{ marginLeft: '4px' }}>编辑</Button>
                <Modal
                    title="编辑认证信息"
                    visible={showModal}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                {configData.slice(0, 3).map((item, index) => (
                    <div key={index}>
                        <span>{item.title}: </span>
                        <Input id={`editContent${index}`} defaultValue={item.content} />
                    </div>
                ))}
                </Modal>
            </div>
            <div>
                {configData.slice(3, 4).map((item, index) => (
                    <div key={index}>
                        <span>{item.title}: {item.content}</span>
                        <Button onClick={handleEditRow4} style={{ marginLeft: '4px' }}>编辑</Button>
                    </div>
                ))}
                <Modal
                    title="编辑LDAP配置"
                    visible={showModalRow4}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                    {configData.slice(3, 4).map((item, index) => (
                        <div key={index}>
                            <span>{item.title}: </span>
                            <Input id={`editContent${index + 4}`} defaultValue={item.content} />
                        </div>
                    ))}
                </Modal>
            </div>
            <div>
                {configData.slice(4, 5).map((item, index) => (
                    <div key={index}>
                        <span>{item.title}: {item.content}</span>
                        <Button onClick={handleEditRow5} style={{ marginLeft: '4px' }}>编辑</Button>
                    </div>
                ))}
                <Modal
                    title="编辑CAS配置"
                    visible={showModalRow5}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                    {configData.slice(4, 5).map((item, index) => (
                        <div key={index}>
                            <span>{item.title}: </span>
                            <Input id={`editContent${index + 4}`} defaultValue={item.content} />
                        </div>
                    ))}
                </Modal>
            </div>
            <div>
                {configData.slice(5, 6).map((item, index) => (
                    <div key={index}>
                        <span>{item.title}: {item.content}</span>
                        <Button onClick={handleEditRow6} style={{ marginLeft: '4px' }}>编辑</Button>
                    </div>
                ))}
                <Modal
                    title="编辑OAUTH2配置"
                    visible={showModalRow6}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                    {configData.slice(5, 6).map((item, index) => (
                        <div key={index}>
                            <span>{item.title}: </span>
                            <Input id={`editContent${index + 5}`} defaultValue={item.content} />
                        </div>
                    ))}
                </Modal>
            </div>
        </div>
    );
};

export default ConfigPage;