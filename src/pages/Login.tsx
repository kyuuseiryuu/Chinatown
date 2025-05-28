import React, { useState } from 'react'
import { Button, Space, Input } from 'antd';
import { useUserState } from '../stores/user';
import { useNavigate } from 'react-router';

function Login() {
  const [name, setName] = useState('');
  const user = useUserState(state => state);
  const navigator = useNavigate();
  const handleLogin = React.useCallback(() => {
    if (!name) return;
    user.setUsername(name);
    navigator('/');
  }, [name, user, navigator]);
  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: 8 }}>
      <Input value={name} onChange={e => setName(e.target.value)} size="large" placeholder="Name" />
      <Button disabled={!name} block size="large" type="primary" onClick={handleLogin}>登录</Button>
    </Space>
  )
}

export default Login