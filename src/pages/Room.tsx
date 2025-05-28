import React from 'react';
import { Typography, Button, Modal, Space, Breadcrumb } from 'antd';
import { useMatch, useNavigate } from 'react-router';
import { QrcodeOutlined } from '@ant-design/icons';
import { QRCodeCanvas } from 'qrcode.react';
import { useRoomState } from '../stores/room';

const Room = () => {
  const match = useMatch('/rooms/:id');
  const roomId = match?.params.id;
  const navigator = useNavigate();
  const room = useRoomState(state => state.roomList.find(r => r.id === roomId));
  const [codeModalVisible, setCodeModalVisible] = React.useState(false);

  const handleShowCode = React.useCallback(() => {
    if (!roomId) return;
    console.debug('显示房间二维码:', roomId);
    setCodeModalVisible(true);
  }, [roomId]);

  const handleCloseCode = React.useCallback(() => {
    setCodeModalVisible(false);
  }, []);

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
