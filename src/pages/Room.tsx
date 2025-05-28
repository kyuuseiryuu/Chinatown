import React, { useCallback, useMemo } from 'react';
import { Typography, Button, Modal, Space, Breadcrumb } from 'antd';
import { useMatch, useNavigate } from 'react-router';
import { DeleteOutlined, QrcodeOutlined } from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import { useRoomState } from '../stores/room';
import { useUserState } from '../stores/user';

const Room = () => {
  const match = useMatch('/rooms/:id');
  const roomId = match?.params.id;
  const navigator = useNavigate();
  const user = useUserState(state => state);
  const roomState = useRoomState(state => state);
  const room = roomState.roomList.find(r => r.id === roomId);
  const isMyRoom = useMemo(() => user.username === room?.owner, [user, room]);
  const [codeModalVisible, setCodeModalVisible] = React.useState(false);

  const handleShowCode = React.useCallback(() => {
    if (!roomId) return;
    console.debug('显示房间二维码:', roomId);
    setCodeModalVisible(true);
  }, [roomId]);

  const handleCloseCode = React.useCallback(() => {
    setCodeModalVisible(false);
  }, []);

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
        <Button icon={<QrcodeOutlined />} onClick={handleShowCode} size="large" block>
          显示二维码
        </Button>
        { isMyRoom && <Button block icon={<DeleteOutlined />} variant="filled" color='danger' onClick={handleDestroyRoom}>
          销毁房间
        </Button>}
      </Space>
      <Modal visible={codeModalVisible} onCancel={handleCloseCode} onOk={handleCloseCode} footer={null}>
        <Space direction="vertical" style={{ textAlign: 'center', width: '100%' }}>
          <Typography.Title level={4}>扫码加入房间</Typography.Title>
          <QRCodeCanvas
            value={roomId || ''}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </Space>
      </Modal>
    </div>
  );
}

export default Room;
