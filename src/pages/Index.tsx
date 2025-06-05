import React, { useEffect, useState } from 'react'
import { useLogto, type IdTokenClaims } from '@logto/react';
import { Avatar, Space, Typography, Button, } from 'antd';
import { useUserState } from '@/stores/user';
import RoomList from '@/components/RoomList';
import { LogoutOutlined } from '@ant-design/icons';

const HOST = window.location.origin;

function App() {
  const { isAuthenticated, getIdTokenClaims, signIn } = useLogto();
  const [user, setUser] = useState<IdTokenClaims>();

  const isLogin = useUserState(state => state.logined);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const claims = await getIdTokenClaims();
        if (!claims) return;
        setUser(claims);
        if (!isLogin) {
          console.debug('用户信息:', claims);
        }
        useUserState.getState().loginSuccess(claims);
      }
    })();
  }, [getIdTokenClaims, isAuthenticated, isLogin]);
  const username = useUserState(state => state.username);

  const handleLogin = React.useCallback(() => {
    signIn(`${HOST}/callback`);
  }, [signIn]);

  const handleLogout = React.useCallback(() => {
    useUserState.getState().logout();
    // signOut(HOST);
  }, []);

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
