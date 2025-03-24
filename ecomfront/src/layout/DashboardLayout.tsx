import Sidebar from "@/components/custom/SideBar";
import { Navigate, Outlet } from "react-router-dom";
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  return (
    // <div>
    //   <div
    //     style={{ minHeight: "100vh", display: "flex" }}
    //     // style={{maxHeight: `calc(100vh - 36px)`, overflow:"auto"}}
    //     //  className='h-'
    //   >
    //     <div className=" pt-2">
    //     <Sidebar/>
    //     </div>
    //     {/* <div className="flex flex-col bg-green-300">fuck</div> */}

    //     <div
    //       style={{ display: "flex", width: "100vw", justifyContent: "center" }}
    //     >
    //       <Outlet />
    //     </div>
    //   </div>
    // </div>
    <Layout>
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'Manage Product',
            onClick: () => {navigate('/dashboard/product')},
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'Manage Category',
            onClick: () => {navigate('/dashboard/category')},

          },
     
        ]}
      />
    </Sider>
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
      </Header>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Outlet/>
      </Content>
    </Layout>
  </Layout>
  );
};

export default DashboardLayout;
