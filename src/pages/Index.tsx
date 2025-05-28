import React from 'react'
import { Space, Typography, Button, } from 'antd';
import { useNavigate } from 'react-router';
import { useUserState } from '../stores/user';
import { useRoomState } from "../stores/room";

function App() {
  const navigator = useNavigate();

  const username = useUserState(state => state.username);
  const room = useRoomState(state => state);
  const isLogin = Boolean(username);

  const handleLogin = React.useCallback(() => {
    navigator('/login');
  }, [navigator]);

  const handleLogout = React.useCallback(() => {
    useUserState.getState().setUsername('');
    navigator('/');
  }, [navigator]);

  const handleCreateRoom = React.useCallback(async () => {
    const newRoom = await room.createRoom?.(`${username}的房间`);
    console.debug('创建房间:', newRoom);
    navigator(`/rooms/${newRoom?.id}`);
  }, [navigator, room, username]);

  const handleJoinRoom = React.useCallback(() => {
    navigator('/join-room');
  }, [navigator]);

  return (
    <>
      {isLogin && <Typography.Title level={3}>欢迎回来，{username}!</Typography.Title>}
      {!isLogin && <Typography.Title level={3}>欢迎使用 Chinatown 发牌器</Typography.Title>}
      <Space direction="vertical" size="large" style={{ width: '100%', padding: 8 }}>
        { !isLogin ? (
          <Button onClick={handleLogin} size='large' block>登录</Button>
        ) : (
          <>
            <Button onClick={handleCreateRoom} size='large' block>创建房间</Button>
            <Button onClick={handleJoinRoom} size='large' block>加入房间</Button>
            <Button variant="filled" color="danger" onClick={handleLogout} size='large' block>退出</Button>
          </>
        ) }
      </Space>
    </>
  )
}

export default App
