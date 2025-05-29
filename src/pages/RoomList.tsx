import { Breadcrumb, Button, List } from 'antd';
import { useNavigate } from 'react-router';
import { useRoomState, getShortID, type Room } from '../stores/room';
import { useCallback } from 'react';
import { useUserState } from '../stores/user';
import { DeleteOutlined, LoginOutlined } from '@ant-design/icons';

const RoomList = () => {
  const navigator = useNavigate();
  const roomState = useRoomState(state => state);
  const username = useUserState(state => state.username);
  const isMyRoom = useCallback((room: Room) => {
    return room.owner === username;
  }, [username]);

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigator('/')}>首页</Breadcrumb.Item>
        <Breadcrumb.Item>房间列表</Breadcrumb.Item>
      </Breadcrumb>
      {/* <Typography.Title level={2}>房间列表</Typography.Title> */}
      <List
        dataSource={roomState.roomList.reverse()}
        renderItem={e => (
          <List.Item
            actions={[
              isMyRoom(e) ? <Button icon={<DeleteOutlined />} variant="filled" color='danger' onClick={() => roomState.destroyRoom(e.id)}>销毁房间</Button> : <></>,
              <Button type='primary' icon={<LoginOutlined />} onClick={() => navigator(`/rooms/${e.id}`)}>加入房间</Button>,
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
