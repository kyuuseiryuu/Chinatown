import React from 'react'
import { Button, Space } from 'antd';
// import { useUserState } from '../stores/user';
// import { useNavigate } from 'react-router';
import { useLogto } from '@logto/react';

function Login() {
  const { signIn, signOut, isAuthenticated } = useLogto();
  // const [name, setName] = useState('');
  // const user = useUserState(state => state);
  // const navigator = useNavigate();
  // const handleLogin = React.useCallback(() => {
  //   // if (!name) return;
  //   // user.setUsername(name);
  //   // navigator('/');
  // }, []);
  return (
    <Space direction="vertical" size="large" style={{ width: '100%', padding: 8 }}>
      {/* <Input value={name} onChange={e => setName(e.target.value)} size="large" placeholder="Name" /> */}
      {!isAuthenticated ? (
        <Button block size="large" type="primary" onClick={() => signIn('http://localhost:5173/callback')}>登录</Button>
      ) : (
        <Button block size="large" type="primary" onClick={() => signOut('http://localhost:5173')}>登出</Button>
      )}
    </Space>
  )
}

export default Login