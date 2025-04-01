import React, { useState } from 'react';
import {Card, Form, Input, Button, message} from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/config';
import bcrypt from 'bcryptjs';

import {useAuth} from "../../context/AuthContext";

function Login() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { login } = useAuth();
    const onFinish = (values) => {
        // const hashedPassword = bcrypt.hashSync("admin123", salt);
        // console.log("hashedPassword",hashedPassword)



        fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(response => {
                console.log("response",response)
                if (response.ok) {
                    return response.json();
                }
                throw new Error('登录失败');
                message.error('登录失败');
            })
            .then(data => {
                console.log('登录成功:', data);
                login(data);
                message.success('登录成功');
                navigate('/AdminPage'); // 登录成功后跳转)
            })
            .catch(error => {
                console.error('登录错误:', error);
                message.error('登录失败');
            });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="登录" style={{ width: 300 }}>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Login;