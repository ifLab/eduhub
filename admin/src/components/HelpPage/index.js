import React, { useState, useEffect } from 'react';
import {Button, Modal, Input, message} from 'antd';
import helpData from '../../data/help.json'; // 引入帮助列表数据
import { API_URL } from '../../config/config'

const HelpPage = () => {
    const [data, setData] = useState(helpData);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [isModified, setIsModified] = useState(false);

    const handleViewContent = (record) => {
        setCurrentRecord(record);
        setEditedContent(record.content);
        setIsModalVisible(true);
    };

    const handleSave = () => {
        const newData = data.map(item => {
            if (item.title === currentRecord.title) {
                return { ...item, content: editedContent };
            }
            return item;
        });
        setData(newData);
        setIsModified(true);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        if (isModified) {
            fetch(`${API_URL}/helpData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.text())
            .then(messages => {
                // alert(message);
                message.success("修改成功!")
                setIsModified(false);
            });
        }
    }, [isModified, data]);

    return (
        <div>
            {data.map((record, index) => (
                <div key={index}>
                    <h3>{record.title}</h3>
                    <p>{record.content}</p>
                    <Button onClick={() => handleViewContent(record)}>修改</Button>
                </div>
            ))}
            <Modal
                title="修改记录内容"
                visible={isModalVisible}
                onOk={handleSave}
                onCancel={handleCancel}
            >
                {currentRecord && (
                    <div>
                        <h3>{currentRecord.title}</h3>
                        <Input.TextArea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default HelpPage;