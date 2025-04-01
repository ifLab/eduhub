    import React, {useEffect, useState} from 'react';
    import {Table, Button, Popconfirm, Form, Modal, Input, message} from 'antd';
    import { API_URL } from '../../config/config'

    const ApplicationPage = () => {

        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'API',
                dataIndex: 'api',
                key: 'api',
            },
            {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                    <>
                        <Button type="link" onClick={() => handleEdit(record)}>修改</Button>
                        <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.key)}>
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    </>
                ),
            },
        ];
        const [data, setData] = useState([
        ]);
        const [currentRecord, setCurrentRecord] = useState(null);
        const [isModalVisible, setIsModalVisible] = useState(false);
        const [isAddModalVisible, setIsAddModalVisible] = useState(false);
        const [form] = Form.useForm();
        const [addForm] = Form.useForm();
        const [searchText, setSearchText] = useState('');

        const fetchData = () =>{
            fetch(`${API_URL}/getDify_keys`)
                .then(response => response.json())
                .then(data => {
                    console.log("data",data)
                    // 将对象转换为数组，并添加key属性以供Ant Design的Table组件使用
                    const formattedData = Object.entries(data).map(([key, value], index) => ({
                        key: index.toString(),
                        name: key,
                        api: value,
                    }));
                    setData(formattedData);
                })
                .catch(error => console.error('Failed to fetch data:', error));
        }

        const handleSearch = (e) => {
            setSearchText(e.target.value);
        };
        const filteredData = data.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));


        useEffect(() => {
            fetchData();
        }, []);
        const handleEdit = (record) => {
            setCurrentRecord(record);
            setIsModalVisible(true);
            form.setFieldsValue({
                name: record.name,
                api: record.api,
            });
        };
        const handleDelete = (key) => {
            // const nameToDelete = data.find(item => item.key === key).name;
            fetch(`${API_URL}/deleteKeyData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.find(item => item.key === key).name, // 获取要删除数据的名称
                }),
            })
                .then(async response => {
                    const textMessage = await response.text();
                    if (!response.ok) {
                        // message.error('删除失败,该应用已被使用!');
                        throw new Error(textMessage);
                    }
                    return textMessage;
                })
                .then(messages => {
                    console.log(messages);
                    // 请求成功后更新前端数据
                    setData(data.filter(item => item.key !== key));
                    message.success('删除成功');
                })
                .catch(error => {
                    console.error('Failed to delete data:', error);
                    message.error(error.message); // 使用 message 组件显示错误提示
                });


            const nameToDelete = data.find(item => item.key === key).name;
            fetch(`${API_URL}/deleteChatByName/${encodeURIComponent(nameToDelete)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(async response => {
                    const textMessage = await response.text();
                    if (!response.ok) {
                        // 如果响应状态码不是2xx，抛出错误
                        throw new Error(textMessage || '删除失败');
                    }
                    return textMessage;
                })
                .then(messages => {
                    console.log(messages);
                    // 请求成功后更新前端数据
                    setData(data.filter(item => item.name !== nameToDelete));
                    // message.success('删除成功');
                })
                .catch(error => {
                    console.error('Failed to delete chat by name:', error);
                    // message.error(error.message); // 使用 message 组件显示错误提示
                });

            fetch(`${API_URL}/deleteTeacherChatByName/${encodeURIComponent(nameToDelete)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(async response => {
                    const textMessage = await response.text();
                    if (!response.ok) {
                        // 如果响应状态码不是2xx，抛出错误
                        throw new Error(textMessage || '删除失败');
                    }
                    return textMessage;
                })
                .then(messages => {
                    console.log(messages);
                    // 请求成功后更新前端数据
                    setData(data.filter(item => item.name !== nameToDelete));
                    // message.success('删除成功');
                })
                .catch(error => {
                    console.error('Failed to delete chat by name:', error);
                    // message.error(error.message); // 使用 message 组件显示错误提示
                });

        };
        const handleOk = () => {
            form
                .validateFields()
                .then(values => {
                    // 这里可以处理表单提交逻辑，例如更新数据
                    console.log('Received values of form: ', values);
                    fetch(`${API_URL}/updateKeysData`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            originalName: currentRecord.name, // 当前记录的原始名称
                            newName: values.name, // 表单中的新名称
                            newValue: values.api, // 表单中的新值
                        }),
                    })
                        .then(response => response.text())
                        .then(message => {
                            console.log(message);
                            fetchData();
                            fetch(`${API_URL}/editChatName`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    originalName: currentRecord.name, // 当前记录的原始名称
                                    newName: values.name, // 表单中的新名称
                                }),
                            });
                            fetch(`${API_URL}/editTeacherChatName`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    originalName: currentRecord.name, // 当前记录的原始名称
                                    newName: values.name, // 表单中的新名称
                                }),
                            });
                            return
                            // setIsModalVisible(false);
                            // 可能需要重新获取更新后的数据
                        })
                        .catch(error => console.error('Failed to update data:', error));
                    // 更新表格数据等逻辑...
                    fetchData()
                    setIsModalVisible(false);

                    //TODO 同时修改studentChat.json 文件


                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
        };

        const handleAddOk = () => {
            addForm
                .validateFields()
                .then(values => {
                    // 发送添加应用的请求到服务器
                    fetch(`${API_URL}/addApplication`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: values.appName,
                            api: values.appAPI,
                        }),
                    })
                        .then(response => response.text())
                        .then(messages => {
                            console.log(messages);
                            if (messages === 'Application already exists'){
                                message.error('应用已存在');
                            }
                            // 添加成功后刷新数据
                            fetchData();
                            // 关闭模态框

                            setIsAddModalVisible(false);
                        })
                        .catch(error => console.error('Failed to add application:', error));
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
        };


        const handleCancel = () => {
            setIsModalVisible(false);
        };

        const handleAddCancel = () => {
            setIsAddModalVisible(false);
        };

        const handleAdd = () => {
            setCurrentRecord(null);
            setIsAddModalVisible(true);
            addForm.resetFields();
        };

        return (
            <>
                <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16,float: 'right' }}>添加应用</Button>
                <Input
                    placeholder="搜索名称"
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200, marginBottom: 16 }}
                />
                <Table columns={columns} dataSource={filteredData} />
                <Modal title="修改" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form form={form} layout="vertical" name="form_in_modal">
                        <Form.Item
                            name="name"
                            label="名称"
                            rules={[{ required: true, message: '请输入名称!' }]}
                        >
                            <Input  />
                        </Form.Item>
                        <Form.Item
                            name="api"
                            label="API"
                            rules={[{ required: true, message: '请输入API!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title="添加应用" visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
                    <Form form={addForm} layout="vertical" name="add_form_in_modal">
                        <Form.Item
                            name="appName"
                            label="应用名称"
                            rules={[{ required: true, message: '请输入应用名称!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="appAPI"
                            label="应用API"
                            rules={[{ required: true, message: '请输入应用API!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    };

    export default ApplicationPage;