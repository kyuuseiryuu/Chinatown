import { Button, List } from 'antd';
import { useNavigate } from 'react-router';
import { useRoomState, getShortID, type Room } from '@/stores/room';
import { useCallback } from 'react';
import { useUserState } from '@/stores/user';
import { FireOutlined, LoginOutlined } from '@ant-design/icons';


const RoomList = () => {
  const navigator = useNavigate();
  const roomState = useRoomState(state => state);
  const username = useUserState(state => state.username);
  const room = useRoomState(state => state);

  const isMyRoom = useCallback((room: Room) => {
    return room.owner === username;
  }, [username]);

  const handleCreateRoom = useCallback(async () => {
    await room.createRoom?.(`${username} 的房间`);
  }, [username, room]);

  const hasMyRoom = roomState.roomList.some(e => isMyRoom(e));

  return (
    <div>
      <Button type='primary' onClick={handleCreateRoom} size='large' block>
        {hasMyRoom ? '进入房间' : '创建房间'}
      </Button>
      <List
        dataSource={roomState.roomList.reverse()}
        renderItem={e => (
          <List.Item
            actions={[
              isMyRoom(e) ?
                <Button 
                  icon={<FireOutlined />}
                  variant="filled"
                  color='danger'
                  onClick={() => roomState.destroyRoom(e.id)}
                >
                  销毁房间
                </Button>
                : <></>,
              <Button icon={<LoginOutlined />} onClick={() => navigator(`/rooms/${e.id}`)}>加入房间</Button>,
            ]}
          >
            <List.Item.Meta title={`${e.name} (${getShortID(e.id)})`} />
          </List.Item>
        )}
      />
    </div>
  );
}

export default RoomList;
