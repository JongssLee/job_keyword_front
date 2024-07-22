import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Form, Typography, message, Card, Row, Col } from 'antd';
import axios from 'axios';
import Layout from './Layout';
import KeywordForm from './KeywordForm';

const { Option } = Select;
const { Text, Title } = Typography;

const App = ({ token, setToken }) => {
  const [jobs, setJobs] = useState({});
  const [searchType, setSearchType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const fetchJobs = async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      console.log('Fetched data:', response.data);
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching jobs');
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/auth/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  useEffect(() => {
    fetchJobs('http://localhost:8000/jobs');
  }, []);

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleSearch = (keyword = '') => {
    let url = 'http://localhost:8000/jobs';
    if (searchType === 'company') {
      url = `http://localhost:8000/jobs/${searchTerm}`;
    } else if (searchType === 'keyword' || keyword) {
      url = `http://localhost:8000/jobs/search/${keyword || searchTerm}`;
    }
    fetchJobs(url);
  };

  const renderItem = item => {
    const { 공고제목 = '', 직군 = '', 신입_경력 = '', 근무형태 = '', 링크 = '', 직무내용 = [] } = item;

    return (
      <Col xs={24} sm={12} md={8} lg={6} xl={6} key={item.id}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0 }}>{공고제목}</Title>
              <Button type="link" href={링크} target="_blank" rel="noopener noreferrer">
                Go to Link
              </Button>
            </div>
          }
          style={{ marginBottom: '20px', height: '100%' }}
          bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <p><Text strong style={{ fontSize: '16px' }}>Company:</Text> {item.company}</p>
            <p><Text strong style={{ fontSize: '16px' }}>Position:</Text> {직군}</p>
            <p><Text strong style={{ fontSize: '16px' }}>Experience:</Text> {신입_경력}</p>
            <p><Text strong style={{ fontSize: '16px' }}>Employment Type:</Text> {근무형태}</p>
            <ul>
              {직무내용.map((content, index) => (
                <li key={index} style={{ fontSize: '14px' }}>{content}</li>
              ))}
            </ul>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <Layout token={token} setToken={setToken} user={user}>
      <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: '20px' }}>
        <Form.Item>
          <Select value={searchType} onChange={setSearchType} style={{ width: 120 }}>
            <Option value="all">All</Option>
            <Option value="company">Company</Option>
            <Option value="keyword">Keyword</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={searchType === 'all'}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Search</Button>
        </Form.Item>
      </Form>
      {token && <KeywordForm token={token} onKeywordSearch={handleSearch} />}
      <Row gutter={[16, 16]}>
        {Array.isArray(jobs) ? jobs.map(renderItem) : Object.entries(jobs).flatMap(([company, jobList]) =>
          Array.isArray(jobList) ? jobList.map(job => renderItem({ ...job, company })) : []
        )}
      </Row>
    </Layout>
  );
};

export default App;
