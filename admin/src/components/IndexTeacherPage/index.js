import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Form, Input, Select, message} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { API_URL } from '../../config/config'

const IndexTeacherPage = () => {
    const [folders, setFolders] = useState([]);
    const [chats, setChats] = useState([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingChat, setEditingChat] = useState(null);
    const [form] = Form.useForm();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();
    const [appNames, setAppNames] = useState([]);
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
    const [isEditFolderModalVisible, setIsEditFolderModalVisible] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    // const [isFolderModalVisible, setIsFolderModalVisible] = useState(false); // 控制模态框显示
    const [folderForm] = Form.useForm(); // Ant Design Form实例
    const [currentFolder, setCurrentFolder] = useState(null); // 当前正在编辑的文件夹，nu
    const fetchAppNames = () => {
        fetch(`${API_URL}/getAppNames`) // 假设这是获取应用名称列表的API
            .then(response => response.json())
            .then(data => {
                setAppNames(data); // 假设返回的数据是应用名称列表
            })
            .catch(error => console.error('Failed to fetch app names:', error));
    };
    // 假设 jsonData 是从文件、API 或其他方式获取的 JSON 数据
    const jsonData = {
        "Folders": [
            // Folders 数据...
        ],
        "Chats": [
            // Chats 数据...
        ]
    };
    //获取studentChat数据
    useEffect(() => {
        getData();
        fetchAppNames();
    }, []);

    const getData = () => {
        fetch(`${API_URL}/getTeacherChat`)
            .then(response => response.json())
            .then(data => {
                console.log("data",data)
                setFolders(data.Folders);
                setChats(data.Chats);
            })
            .catch(error => console.error('Failed to fetch data:', error));
    }
    const showEditModal = (chat) => {
        setEditingChat(chat);
        setIsEditModalVisible(true);
        form.setFieldsValue({
            name: chat.name,
            icon: chat.icon || '',
            folderId: chat.folderId,
        });
    };

    const handleEdit = () => {
        form.validateFields().then(values => {
            // 假设编辑的聊天信息包括名字、图标和所在文件夹的名字
            const { name, icon, folderId } = values;
            // 从编辑中的聊天信息中找到对应的文件夹名字
            const folderName = folders.find(folder => folder.id === folderId)?.name;

            if (!folderName) {
                console.error('Selected folder not found');
                return;
            }

            fetch(`${API_URL}/editChatTeacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingChat.id, // 使用当前正在编辑的聊天的ID
                    newName: name,
                    newIcon: icon,
                    newFolderName: folderName,
                }),
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error('Failed to edit chat');
                    }
                })
                .then(() => {
                    console.log('Chat updated successfully');
                    // 关闭模态框
                    setIsEditModalVisible(false);
                    // 重置表单字段
                    form.resetFields();
                    // 重新获取聊天数据以更新前端显示
                    // 这里需要实现获取聊天数据的逻辑
                    getData();
                })
                .catch(error => {
                    console.error('Failed to update chat:', error);
                });
        });
    };
    const handleDelete = (id, name) => {
        Modal.confirm({
            title: '确定要删除吗？',
            content: '此操作不可撤销',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {

                fetch(`${API_URL}/deleteChatTeacher/${id}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (response.ok) {
                            getData();
                        } else {
                            throw new Error('Failed to delete chat');
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            // 两次删除操作都成功后重新获取数据
                            getData();
                        } else {
                            Modal.error({
                                title: '删除失败',
                                content: '无法删除键数据，请稍后再试',
                            });
                        }
                    })
                    .catch(error => console.error('Failed to delete chat:', error));
            },
        });
    };

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };
    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };
    const handleAddSubmit = () => {
        addForm.validateFields().then(values => {
            const newChat = {
                id: uuidv4(), // 自动生成UUID
                name: values.name,
                icon: values.icon,
                folderId: values.folderId
            };
            fetch(`${API_URL}/addChatTeacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newChat),
            })
                .then(response => {
                    if (response.ok) {
                        getData(); // 重新获取数据以更新表格
                        setIsAddModalVisible(false); // 关闭模态框
                        addForm.resetFields(); // 重置表单字段
                    } else {
                        throw new Error('Failed to add chat');
                    }
                })
                .catch(error => {
                    console.error('Failed to add chat:', error);
                });
        });
    };

    const showEditFolderModal = (folder) => {
        setCurrentFolder(folder);
        setIsEditFolderModalVisible(true);
        // 这里可以设置表单的初始值
    };

    const showFolderModal = (folder) => {
        setCurrentFolder(folder); // 设置当前正在编辑的文件夹，如果是添加操作，则为null
        folderForm.setFieldsValue({
            name: folder ? folder.name : '', // 如果folder存在，则使用folder的name，否则默认为空字符串
            type: folder ? folder.type : 'chat', // 如果folder存在，则使用folder的type，否则默认为'chat'
            deletable: folder ? folder.deletable.toString() : 'false', // 如果folder存在，则使用folder的deletable，否则默认为false
        });
        setIsFolderModalVisible(true); // 显示模态框
    };

    const handleAddFolder = (folder) => {
        const folderWithCorrectDeletable = {
            ...folder,
            deletable: folder.deletable.toString() === 'true', // 将字符串转换为布尔值
        };
        fetch(`${API_URL}/addFolderTeacher`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(folderWithCorrectDeletable),
        })
            .then(response => response.json())
            .then(data => {
                setIsFolderModalVisible(false);
                message.success("添加文件夹成功");
                getData(); // 重新获取数据以更新UI
            })
            .catch(error => {
                console.error('Failed to add folder:', error);
                message.error("添加文件夹失败");
            });
        // 从表单获取数据，然后发送API请求
        // 假设你有一个表单来收集文件夹的数据
    };

// 处理编辑文件夹
    const handleEditFolder = (id, folder) => {
        console.log("edit folder", id, folder,typeof (folder.deletable));
        if (typeof (folder.deletable)!= "boolean"){
            if(folder.deletable=="true"){
                folder.deletable=true;
            }else {
                folder.deletable=false;
            }
        }
        fetch(`${API_URL}/editFolderTeacher/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(folder),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setIsFolderModalVisible(false);
                message.success("文件夹更新成功");
                getData(); // 重新获取数据以更新UI
            })
            .catch(error => {
                console.error('Failed to edit folder:', error);
                message.error("更新文件夹失败");
            });
    };

// 处理删除文件夹
    const handleDeleteFolder = (folderId) => {
        Modal.confirm({
            title: '确定要删除这个文件夹吗？',
            content: '此操作不可撤销',
            onOk: () => {
                fetch(`${API_URL}/deleteFolderTeacher/${folderId}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        message.success("文件夹删除成功");
                        getData(); // 重新获取数据以更新UI
                    })
                    .catch(error => {
                        console.error('Failed to delete folder:', error);
                        message.error("删除文件夹失败");
                    });
            },
        });
    };

    const folderColumns = [
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'UUID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '用户是否能删除',
            dataIndex: 'deletable',
            key: 'deletable',
            render: deletable => (deletable ? '是' : '否'),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, folder) => (
                <>
                    <Button onClick={() => showFolderModal(folder)} style={{ marginRight: 8 }}>编辑</Button>
                    <Button onClick={() => handleDeleteFolder(folder.id)} danger>删除</Button>
                </>
            ),
        }

    ];

    const chatColumns = [
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'UUID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            render: icon => icon ? <img src={icon} alt="图标" style={{ width: '24px', height: '24px' }} /> : '无',
        },

        {
            title: '所在文件夹',
            dataIndex: 'folderId',
            key: 'folderId',
            render: folderId => {
                // 查找文件夹名字
                const folder = folders.find(folder => folder.id === folderId);
                return folder ? folder.name : '未知';
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>编辑</Button>
                    <Button onClick={() => handleDelete(record.id, record.name)} danger>删除</Button>
                </>
            ),
        },
    ];


    useEffect(() => {
        getData();
        fetchAppNames();
    }, []);


    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(
            folders,
            result.source.index,
            result.destination.index
        );

        setFolders(items);
        updateFoldersOnServer(items);
        // Here you would also call an API or perform an action to persist the order change
    };

    const updateFoldersOnServer = (folders) => {
        fetch(`${API_URL}/updateFoldersOrderTeacher`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Folders: folders }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // 确保响应的内容类型是 application/json
            })
            .then(data => {
                message.success(data.message); // 使用服务器返回的消息
            })
            .catch(error => {
                console.error('Failed to update folder order:', error);
                message.error("更新文件夹顺序失败");
            });
    };
    const DraggableComponent = ({ children, className, style, ...restProps }) => {
        // We need to pass the index and draggableId which we can take from restProps['data-row-key']
        // const index = folders.findIndex((folder) => folder.id === restProps['data-row-key']);
        const index = (() => {
            for (let i = 0; i < folders.length; i++) {
                if (folders[i].id === restProps['data-row-key']) {
                    return i;
                }
            }
            return -1; // 如果没有找到匹配项，返回-1
        })();
        return (
            <Draggable draggableId={restProps['data-row-key']} index={index}>
                {(provided, snapshot) => (
                    <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={className}
                        style={{
                            ...style,
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? 'lightgreen' : 'white',
                        }}
                    >
                        {children}
                    </tr>
                )}
            </Draggable>
        );
    };




    return (
        <>
            <h2>文件夹</h2>
            <Button type="primary" onClick={() => showFolderModal(null)} style={{ marginBottom: 16, float: 'right' }}>
                新增文件夹
            </Button>
            {/*<Table dataSource={folders} columns={folderColumns} rowKey="id"/>*/}
            {/*<DragDropContext onDragEnd={onDragEnd}> */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Table
                    dataSource={folders}
                    columns={folderColumns}
                    rowKey="id"
                    pagination={false}
                    components={{
                        body: {
                            wrapper: DroppableComponent,
                            row: DraggableComponent,
                        },
                    }}
                />
            </DragDropContext>
            <Modal
                title={currentFolder ? "编辑文件夹" : "新增文件夹"}
                visible={isFolderModalVisible}
                onOk={() => {
                    folderForm
                        .validateFields()
                        .then(values => {
                            if (currentFolder) {
                                // 如果currentFolder存在，执行编辑文件夹的逻辑
                                handleEditFolder(currentFolder.id, values);
                            } else {
                                // 否则执行添加文件夹的逻辑
                                handleAddFolder(values);
                            }
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}
                onCancel={() => setIsFolderModalVisible(false)}
            >
                <Form form={folderForm} layout="vertical">
                    <Form.Item name="name" label="名字" rules={[{ required: true, message: '请输入文件夹名字!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="类型" rules={[{ required: true, message: '请选择文件夹类型!' }]}>
                        <Select>
                            <Select.Option value="chat">chat</Select.Option>
                            //TODO 不确定是不是prompt
                            <Select.Option value="prompt">prompt</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="deletable" label="是否可删除"rules={[{ required: true, message: '请选择是否可删除!' }]}>
                        <Select>
                            <Select.Option value={true}>true</Select.Option>
                            <Select.Option value={false}>false</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <h2>应用</h2><Button type="primary" onClick={showAddModal} style={{ marginBottom: 16, float: 'right' }}>
            新增应用
        </Button>

            <Table dataSource={chats} columns={chatColumns} rowKey="id"/>
            <Modal title="编辑应用" visible={isEditModalVisible} onOk={handleEdit}
                   onCancel={() => setIsEditModalVisible(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="名字" rules={[{required: true, message: '请输入名字!'}]}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="icon" label="图标">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="folderId" label="所在文件夹" rules={[{required: true, message: '请选择文件夹!'}]}>
                        <Select>
                            {folders.map(folder => (
                                <Select.Option key={folder.id} value={folder.id}>{folder.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="新增应用" visible={isAddModalVisible} onOk={handleAddSubmit} onCancel={handleAddCancel}>
                <Form form={addForm} layout="vertical">
                    <Form.Item name="name" label="名字" rules={[{ required: true, message: '请选择名字!' }]}>
                        <Select showSearch optionFilterProp="children">
                            {appNames.map(appName => (
                                <Select.Option key={appName} value={appName}>{appName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="icon" label="图标">
                        <Input />
                    </Form.Item>
                    <Form.Item name="folderId" label="所在文件夹" rules={[{ required: true, message: '请选择文件夹!' }]}>
                        <Select>
                            {folders.map(folder => (
                                <Select.Option key={folder.id} value={folder.id}>{folder.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {/*<Form.Item name="api" label="API" rules={[{ required: true, message: '请输入API!' }]}>*/}
                    {/*    <Input />*/}
                    {/*</Form.Item>*/}
                </Form>
            </Modal>
        </>
    );
};

const DroppableComponent = (props) => (
    <Droppable droppableId="droppable">
        {(provided, snapshot) => (
            <tbody
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'white' }}
            >
            {props.children}
            {provided.placeholder}
            </tbody>
        )}
    </Droppable>
);

export default IndexTeacherPage;