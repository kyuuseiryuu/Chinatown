import React from 'react';
import { Breadcrumb } from 'antd';
import { useNavigate } from 'react-router';
const RoomList = () => {
  const navigator = useNavigate();
  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigator('/')}>首页</Breadcrumb.Item>
        <Breadcrumb.Item>房间</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Room List</h1>
      <p>This is the room list page.</p>
    </div>
  );
}

export default RoomList;
