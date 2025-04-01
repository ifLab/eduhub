import React, { useState } from 'react';
import { Button } from 'antd';
import { SyncOutlined, CheckOutlined } from '@ant-design/icons';
import { API_URL } from '../config/config';

function RebuildAndRestartButton() {
    const [status, setStatus] = useState('idle'); // 'loading', 'success', 'idle'

    const handleRebuildAndRestart = async () => {
        try {
            setStatus('loading');
            await fetch(`${API_URL}/api/rebuild-and-restart`, { method: 'POST' });
            // 假设请求成功即代表编译开始
            // 设置状态为'success'以更新按钮的视觉效果
            setStatus('success');
            // 2秒后重置状态为'idle'
            setTimeout(() => setStatus('idle'), 2000);
          } catch (error) {
            console.error('Rebuild and restart failed:', error);
            // 处理错误情况，例如可以设置一个错误状态，并显示错误信息
            setStatus('idle'); // 这里简单地将状态重置，实际应用中可能需要更详细的错误处理
          }
        };

    const renderButtonContent = () => {
        switch (status) {
            case 'loading':
                return { icon: <SyncOutlined spin />, text: '正在重建...', style: { color: '#fff' } };
            case 'success':
                return { icon: <CheckOutlined />, text: '编译完成', style: { backgroundColor: 'green', borderColor: 'green', color: '#fff' } };
            default:
                return { icon: <SyncOutlined />, text: '重新编译并重启' };
        }
    };

    const { icon, text, style } = renderButtonContent();

    return (
        <Button
            type="primary"

            icon={icon}
            onClick={handleRebuildAndRestart}
            disabled={status === 'loading'}
            style={{ ...style, transition: 'all 0.3s ease-out' }}
        >
            {text}
        </Button>
    );
}

export default RebuildAndRestartButton;
