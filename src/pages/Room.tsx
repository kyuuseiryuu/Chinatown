import { useCallback, useMemo, useEffect } from 'react';
import { Typography, Button, Space, Breadcrumb, Modal } from 'antd';
import { useMatch, useNavigate } from 'react-router';
import { FireOutlined } from '@ant-design/icons';
import { useRoomState, getShortID } from '@/stores/room';
import { useUserState } from '@/stores/user';
import BreadcrumbItem from '@/components/BreadcrumbItem';
import { useGameStore } from '@/stores/game';

const Room = () => {
  const match = useMatch('/rooms/:id');
  const roomId = match?.params.id;
  const navigator = useNavigate();
  const user = useUserState(state => state);
  const roomState = useRoomState(state => state);
  const room = roomState.roomList.find(r => r.id === roomId);
  const gameStore = useGameStore(state => state);
  const isMyRoom = useMemo(() => user.username === room?.owner, [user, room]);


  const handleDestroyRoom = useCallback(async () => {
    if (!room?.id) return;
    if (!isMyRoom) return;
    await roomState.destroyRoom(room?.id);
    navigator('/');
  }, [isMyRoom, roomState, room, navigator]);


  useEffect(() => {
    if (!user.logined) navigator('/');
    if (!roomId) return;
    if (!gameStore.inRoom) {
      Modal.confirm({
        title: '加入房间',
        content: `是否加入房间 ${room?.name} (id:${getShortID(roomId)})?`,
        onOk: async () => {
          await gameStore.joinRoom(roomId);
          console.debug('已加入房间:', roomId);
        },
        onCancel: () => {
          navigator('/');
        },
      })
    }
  }, [navigator, roomId, gameStore, room, user.logined]);

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <BreadcrumbItem onClick={() => navigator('/')}>首页</BreadcrumbItem>
        <BreadcrumbItem>{room?.name}</BreadcrumbItem>
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
