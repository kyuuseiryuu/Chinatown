import React, { useEffect, useState } from 'react'
import { useLogto, IdTokenClaims } from '@logto/react';
import { Avatar, Space, Typography, Button, } from 'antd';
import { useNavigate } from 'react-router';
import { useUserState } from '../stores/user';
import { useRoomState } from "../stores/room";
import { LogoutOutlined } from '@ant-design/icons';

const HOST = window.location.origin;

function App() {
  const navigator = useNavigate();
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
  const room = useRoomState(state => state);
  const isLogin = Boolean(isAuthenticated);

  const handleLogin = React.useCallback(() => {
    signIn(`${HOST}/callback`);
  }, [signIn]);

  const handleLogout = React.useCallback(() => {
    useUserState.getState().setUsername('');
    signOut(HOST);
  }, [signOut]);

  const handleCreateRoom = React.useCallback(async () => {
    const newRoom = await room.createRoom?.(`${username} 的房间`, username);
    console.debug('创建房间:', newRoom);
    navigator(`/rooms/${newRoom?.id}`);
  }, [navigator, room, username]);

  const handleGotoRooms = React.useCallback(() => {
    navigator('/rooms');
  }, [navigator]);

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
          <>
            <Button onClick={handleCreateRoom} size='large' block>创建房间</Button>
            <Button onClick={handleGotoRooms} size='large' block>房间列表</Button>
          </>
        ) }
      </Space>
    </>
  )
}

export default App
