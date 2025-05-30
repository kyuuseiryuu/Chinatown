import React, { useEffect, useState } from 'react'
import { useLogto, IdTokenClaims } from '@logto/react';
import { Avatar, Space, Typography, Button, } from 'antd';
import { useUserState } from '../stores/user';
import RoomList from '../components/RoomList';
import { LogoutOutlined } from '@ant-design/icons';

const HOST = window.location.origin;

function App() {
  const { isAuthenticated, getIdTokenClaims, signIn, signOut } = useLogto();
  const [user, setUser] = useState<IdTokenClaims>();

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims();
        setUser(claims);
        useUserState.getState().setUsername(claims?.name || '');
        console.debug('用户信息:', claims);
      }
    })();
  }, [getIdTokenClaims, isAuthenticated]);
  const username = useUserState(state => state.username);
  const isLogin = Boolean(isAuthenticated);

  const handleLogin = React.useCallback(() => {
    signIn(`${HOST}/callback`);
  }, [signIn]);

  const handleLogout = React.useCallback(() => {
    useUserState.getState().setUsername('');
    signOut(HOST);
  }, [signOut]);

  return (
    <>
      {isLogin && <Typography.Title level={5}>
        <Space>
          <Avatar src={user?.picture}>{username?.[0]}</Avatar>
          <span>欢迎回来，{username}!</span>
          <Button size="large" type='text' color="red" variant="link" icon={<LogoutOutlined />} onClick={handleLogout} />
        </Space>
      </Typography.Title>}
      <Typography.Title level={3}>欢迎使用 Chinatown 发牌器</Typography.Title>
      <Space direction="vertical" size="large" style={{ width: '100%', padding: 8 }}>
        { !isLogin ? (
          <Button onClick={handleLogin} size='large' block>登录</Button>
        ) : (
          <RoomList />
        ) }
      </Space>
    </>
  )
}

export default App
