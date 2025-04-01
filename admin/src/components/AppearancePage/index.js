import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { API_URL } from '../../config/config'
const AppearancePage = () => {
    const [appearanceData, setAppearanceData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalRow5, setShowModalRow5] = useState(false);
    const [showModalRow6, setShowModalRow6] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/getAppearanceData`)
            .then(response => response.json())
            .then(data => setAppearanceData(data))
            .catch(error => console.error('获取外观数据失败:', error));
    }, []);

    const handleEdit = () => {
        setShowModal(true);
    };

    const handleEditRow5 = () => {
        setShowModalRow5(true);
    };

    const handleEditRow6 = () => {
        setShowModalRow6(true);
    };

    const handleSave = () => {
        const newData = [...appearanceData];
        newData.slice(0, 4).forEach((item, index) => {
            const inputElement = document.getElementById(`editContent${index}`);
            if (inputElement) {
                item.content = inputElement.value;
            }
        });

        fetch(`${API_URL}/saveAppearanceData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
            .then(response => {
                if (response.ok) {
                    message.success('保存成功');
                    setAppearanceData(newData);
                    setShowModal(false);
                } else {
                    throw new Error('保存失败');
                }
            })
            .catch(error => {
                console.error('保存外观数据失败:', error);
                message.error('保存失败');
            });
    };

    const handleCancel = () => {
        setShowModal(false);
        setShowModalRow5(false);
        setShowModalRow6(false);
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                {appearanceData.slice(0, 4).map((item, index) => (
                    <div key={index} style={{ marginRight: '4px' }}>
                        <span>{item.title}: {item.content}</span>
                    </div>
                ))}
                <Button onClick={handleEdit} style={{ marginLeft: '10px' }}>编辑</Button>
                <Modal
                    title="编辑前四条记录"
                    visible={showModal}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                {appearanceData.slice(0, 4).map((item, index) => (
                    <div key={index}>
                        <span>{item.title}: </span>
                        <Input id={`editContent${index}`} defaultValue={item.content} />
                    </div>
                ))}
                </Modal>
            </div>

            <div>
                {appearanceData.slice(4, 5).map((item, index) => (
                    <div key={index}>
                        <span>{item.title}: {item.content}</span>
                        <Button onClick={handleEditRow5} style={{ marginLeft: '10px' }}>编辑</Button>
                    </div>
                ))}
                <Modal
                    title="编辑第五条记录"
                    visible={showModalRow5}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                    {appearanceData.slice(4, 5).map((item, index) => (
                        <div key={index}>
                            <span>{item.title}: </span>
                            <Input id={`editContent${index + 4}`} defaultValue={item.content} />
                        </div>
                    ))}
                </Modal>
            </div>
            <div>
                {appearanceData.slice(5, 6).map((item, index) => (
                    <div key={index}>
                        <span>{item.title}: {item.content}</span>
                        <Button onClick={handleEditRow6} style={{ marginLeft: '10px' }}>编辑</Button>
                    </div>
                ))}
                <Modal
                    title="编辑第六条记录"
                    visible={showModalRow6}
                    onOk={handleSave}
                    onCancel={handleCancel}
                >
                    {appearanceData.slice(5, 6).map((item, index) => (
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

export default AppearancePage;