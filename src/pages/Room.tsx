import React, { useCallback, useMemo } from 'react';
import { Typography, Button, Space, Breadcrumb } from 'antd';
import { useMatch, useNavigate } from 'react-router';
import { FireOutlined } from '@ant-design/icons';
import { useRoomState, getShortID } from '../stores/room';
import { useUserState } from '../stores/user';

const Room = () => {
  const match = useMatch('/rooms/:id');
  const roomId = match?.params.id;
  const navigator = useNavigate();
  const user = useUserState(state => state);
  const roomState = useRoomState(state => state);
  const room = roomState.roomList.find(r => r.id === roomId);
  const isMyRoom = useMemo(() => user.username === room?.owner, [user, room]);


  const handleDestroyRoom = useCallback(async () => {
    if (!room?.id) return;
    if (!isMyRoom) return;
    await roomState.destroyRoom(room?.id);
    navigator('/rooms');
  }, [isMyRoom, roomState, room, navigator]);

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigator('/')}>首页</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigator('/rooms')}>房间</Breadcrumb.Item>
        <Breadcrumb.Item>{room?.name}</Breadcrumb.Item>
      </Breadcrumb>
      
      <Space direction="vertical" size="large" style={{ width: '100%', padding: 8 }}>
        <Typography.Title level={4}>
          <Space>
            <span>{room?.name} (id:{getShortID(room?.id ?? '')})</span>
            { isMyRoom && (
              <Button icon={<FireOutlined />} variant="filled" color='danger' onClick={handleDestroyRoom} />
            )}
          </Space>
        </Typography.Title>
      </Space>
    </div>
  );
}

export default Room;
