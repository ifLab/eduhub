import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, Form, Input, Select, message, Popconfirm, Switch} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { API_URL } from '../../config/config';

const PromptsPage = () => {
    const [prompts, setPrompts] = useState([]);
    const [folders, setFolders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [form] = Form.useForm();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isAddFolderModalVisible, setIsAddFolderModalVisible] = useState(false);
    const [isEditFolderModalVisible, setIsEditFolderModalVisible] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [addFolderForm] = Form.useForm();
    const [editFolderForm] = Form.useForm();

    useEffect(() => {
        fetchPrompts();
    }, []);


    const fetchPrompts = async () => {
        try {
            const response = await fetch(`${API_URL}/getPrompts`);
            const data = await response.json();
            setPrompts(data.Prompts);
            setFolders(data.Folders);
        } catch (error) {
            console.error('Failed to fetch prompts:', error);
        }
    };
    const showModal = (prompt) => {
        setCurrentPrompt(prompt);
        setIsModalVisible(true);
        form.setFieldsValue(prompt);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setCurrentPrompt(null);
    };

    const handleDeletePrompt = (id) => {
        // 假设这里调用API删除提示词
        console.log(`Deleting prompt with id: ${id}`);
        // 实际应用中，这里应该是一个API调用，以下是伪代码
        fetch(`${API_URL}/deletePrompt/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                message.success('提示词删除成功');
                fetchPrompts(); // 重新获取提示词列表
            })
            .catch(error => {
                console.error('删除提示词失败:', error);
                message.error('删除提示词失败');
            });
    };

    const deletePrompt = (id) => {
        Modal.confirm({
            title: '确定要删除这个提示词吗？',
            content: '此操作无法撤销',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                handleDeletePrompt(id);
            },
        });
    };

    const updatePrompt = (values,id) => {
        console.log('Form Values:', values);
        if (!values.folderId){
            values.folderId=null;
        }
        fetch(`${API_URL}/updatePrompt/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values), // 表单中的新值
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                message.success('提示词更新成功!');
                setIsModalVisible(false); // 关闭模态框
                fetchPrompts(); // 重新获取提示词列表以更新UI
            })
            .catch(error => {
                console.error('更新提示词失败:', error);
                message.error('更新提示词失败');
            });
    }

    const showAddFolderModal = () => {
        setIsAddFolderModalVisible(true);
    };


    const handleDeleteFolder = async (folderId) => {
        console.log("folderId",folderId)
        Modal.confirm({
            title: '确定要删除这个文件夹吗？',
            content: '此操作不可撤销',
            onOk: async () => {
                try {
                    const response = await fetch(`${API_URL}/deletePromptFolder/${folderId}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Network response was not ok');
                    }
                    message.success("文件夹删除成功");
                    fetchPrompts(); // 重新获取数据以更新UI
                } catch (error) {
                    console.error('Failed to delete folder:', error);
                    message.error("删除文件夹失败: " + error.message);
                }
            },
        });
    };

    const showEditFolderModal = (folder) => {
        setEditingFolder(folder);
        setIsEditFolderModalVisible(true);
        editFolderForm.setFieldsValue(folder);
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
                    <Button onClick={() => showEditFolderModal(folder)} style={{ marginRight: 8 }}>编辑</Button>
                    <Button onClick={() => handleDeleteFolder(folder.id)} danger>删除</Button>

                </>
            ),
        }
    ];

    const handleAddFolder = async (values) => {
        try {
            const response = await fetch(`${API_URL}/addPromptFolder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            message.success('文件夹添加成功!');
            setIsAddFolderModalVisible(false);
            fetchPrompts(); // 重新获取提示词和文件夹列表以更新UI
        } catch (error) {
            console.error('添加文件夹失败:', error);
            message.error('添加文件夹失败');
        }
    };

    const handleEditFolder = async (values) => {
        console.log("values:", values);
        console.log(editingFolder.id);
        try {
            const response = await fetch(`${API_URL}/updatePromptFolder/${editingFolder.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            message.success('文件夹更新成功!');
            setIsEditFolderModalVisible(false);
            fetchPrompts(); // 重新获取提示词和文件夹列表以更新UI
        } catch (error) {
            console.error('更新文件夹失败:', error);
            message.error('更新文件夹失败');
        }
    };



    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <span>
                    <Button type="link" onClick={() => showModal(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => deletePrompt(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    const showAddModal = () => {
        setIsAddModalVisible(true);
        // 清空表单
        form.resetFields();
        setCurrentPrompt(null); // 确保不在编辑状态
    };

    const addPrompt = async (values) => {
        try {
            const response = await fetch(`${API_URL}/addPrompt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values), // 将表单数据转换为JSON字符串
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newPrompt = await response.json();
            message.success('提示词添加成功!');
            setIsAddModalVisible(false); // 关闭新建提示词的模态框
            fetchPrompts(); // 重新获取提示词列表以更新UI
        } catch (error) {
            console.error('添加提示词失败:', error);
            message.error('添加提示词失败');
        }
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination || (source.index === destination.index && source.droppableId === destination.droppableId)) {
            return;
        }

        const newFolders = reorder(folders, source.index, destination.index);
        setFolders(newFolders);
        // Optionally, update the order on the server here
        updateFoldersOnServer(newFolders)
    };

    const updateFoldersOnServer = (folders) => {
        fetch(`${API_URL}/updatePromptFoldersOrder`, {
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

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };



    const DraggableComponent = ({ className, style, children, ...restProps }) => {
        const index = folders.findIndex(folder => folder.id === restProps['data-row-key']);
        return (
            <Draggable draggableId={String(restProps['data-row-key'])} index={index}>
                {(provided, snapshot) => (
                    <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={className}
                        style={{
                            ...style,
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? 'lightgreen' : '',
                        }}
                    >
                        {children}
                    </tr>
                )}
            </Draggable>
        );
    };



    return (

        <div >

            <h2>文件夹</h2>
            <Button type="primary" onClick={showAddFolderModal} style={{ marginBottom: 16 }}>
                新增文件夹
            </Button>
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


            <Button type="primary" onClick={showAddModal} style={{marginBottom: 16}}>
                新建提示词
            </Button>
            {folders.map(folder => (
                <div key={folder.id} style={{ marginBottom: 20 }}>
                    <h2>{folder.name}</h2>
                    <Table
                        dataSource={prompts.filter(prompt => prompt.folderId === folder.id)}
                        rowKey="id"
                        columns={columns}
                        pagination={false}
                    />
                </div>
            ))}
            {/* 无文件夹的提示词 */}
            <div style={{ marginBottom: 20 }}>
                <h2>无文件夹的提示词</h2>
                <Table
                    dataSource={prompts.filter(prompt => !prompt.folderId)}
                    rowKey="id"
                    columns={columns}
                />
            </div>
            {/* 模态框和其他UI元素 */}
            <Modal
                title="新建提示词"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null} // 使用表单的提交按钮
            >
                <Form
                    form={form}
                    onFinish={currentPrompt ? (values) => updatePrompt(values, currentPrompt.id) : addPrompt}
                >
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{required: true, message: '请输入提示词名称!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                        rules={[{required: true, message: '请输入提示词描述!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="内容"
                        rules={[{required: true, message: '请输入提示词内容!'}]}
                    >
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item
                        name="folderId"
                        label="文件夹"
                    >
                        <Select allowClear>
                            {folders.map(folder => (
                                <Select.Option key={folder.id} value={folder.id}>{folder.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            创建
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="编辑提示词"
                visible={isModalVisible}
                onOk={form.submit}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    initialValues={currentPrompt}
                    onFinish={(values) => {
                        console.log('Form Values:', values);
                        // 这里应该是调用API更新提示词的逻辑
                        setIsModalVisible(false);
                        updatePrompt(values, currentPrompt.id)
                    }}
                    on
                >
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[{required: true, message: '请输入提示词名称!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                        rules={[{required: true, message: '请输入提示词描述!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="内容"
                        rules={[{required: true, message: '请输入提示词内容!'}]}
                    >
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item
                        name="folderId"
                        label="文件夹"
                    >
                        <Select allowClear>
                            {folders.map(folder => (
                                <Select.Option key={folder.id} value={folder.id}>{folder.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="新增文件夹"
                visible={isAddFolderModalVisible}
                onCancel={() => setIsAddFolderModalVisible(false)}
                onOk={() => {
                    addFolderForm
                        .validateFields()
                        .then(values => {
                            handleAddFolder(values);
                            setIsAddFolderModalVisible(false); // 关闭模态框
                            addFolderForm.resetFields(); // 重置表单字段
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={addFolderForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="文件夹名称"
                        rules={[{ required: true, message: '请输入文件夹名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="deletable"
                        label="用户是否能删除"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="编辑文件夹"
                visible={isEditFolderModalVisible}
                onCancel={() => setIsEditFolderModalVisible(false)}
                onOk={() => {
                    editFolderForm
                        .validateFields()
                        .then(values => {
                            handleEditFolder(values, editingFolder.id); // 确保传递当前正在编辑的文件夹ID
                            setIsEditFolderModalVisible(false); // 关闭模态框
                            editFolderForm.resetFields(); // 重置表单字段
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={editFolderForm} layout="vertical" initialValues={{ name: editingFolder?.name, deletable: editingFolder?.deletable }}>
                    <Form.Item
                        name="name"
                        label="文件夹名称"
                        rules={[{ required: true, message: '请输入文件夹名称!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="deletable"
                        label="用户是否能删除"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
const DroppableComponent = (props) => (
    <Droppable droppableId="foldersDroppable">
        {(provided, snapshot) => (
            <tbody
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'white' }}
            >
            {props.children}
            {provided.placeholder}
            </tbody>
        )}
    </Droppable>
);

export default PromptsPage;
