import React from 'react';
import { Row, Col, Button, Typography, Layout as AntLayout } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Header, Content } = AntLayout;

const Layout = ({ children, token, setToken, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AntLayout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '0 20px' }}>
        <Button type="text" onClick={() => navigate('/')}><Title level={2} style={{ margin: 0 }}>Job Portal</Title></Button>
        <div>
          {token ? (
            <>
              <span style={{ marginRight: '20px' }}>{user?.full_name || user?.username}</span>
              <Button type="primary" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>Login</Button>
              <Button onClick={() => navigate('/signup')}>Sign Up</Button>
            </>
          )}
        </div>
      </Header>
      <Content style={{ padding: '50px' }}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;
