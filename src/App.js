import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Form, Row, Col, List, Typography, message } from 'antd';
import axios from 'axios';


const { Option } = Select;
const { Title } = Typography;

const App = () => {
  const [jobs, setJobs] = useState({});
  const [searchType, setSearchType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      console.log('Fetched data:', response.data);  // 데이터를 확인하기 위해 추가
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching jobs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs('http://localhost:8000/jobs');
  }, []);

  useEffect(() => {
    console.log('Jobs state updated:', jobs);  // 상태 업데이트를 확인하기 위해 추가
  }, [jobs]);

  const handleSearch = () => {
    let url = 'http://localhost:8000/jobs';
    if (searchType === 'company') {
      url = `http://localhost:8000/jobs/${searchTerm}`;
    } else if (searchType === 'keyword') {
      url = `http://localhost:8000/jobs/search/${searchTerm}`;
    }
    fetchJobs(url);
  };

  const renderItem = item => {
    const { 공고제목 = '', 직군 = '', 신입_경력 = '', 근무형태 = '', 링크 = '', 직무내용 = [] } = item;

    return (
      <List.Item>
        <Typography.Text mark>[{item.company}]</Typography.Text> 
        <a href={링크} target="_blank" rel="noopener noreferrer">{공고제목}</a> - {직군} - {신입_경력} - {근무형태}
        <div>
          <ul>
            {직무내용.map((content, index) => (
              <li key={index}>{content}</li>
            ))}
          </ul>
        </div>
      </List.Item>
    );
  };

  return (
    <div style={{ padding: '50px' }}>
      <Row justify="center" style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Title level={2}>Job Portal</Title>
          <Form layout="inline" onFinish={handleSearch}>
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
        </Col>
        <Col span={4} offset={4}>
          <Button type="primary" onClick={() => window.location.href = '/signup'}>Sign Up</Button>
        </Col>
      </Row>

      <List
        bordered
        dataSource={Array.isArray(jobs) ? jobs : Object.entries(jobs).flatMap(([company, jobList]) =>
          Array.isArray(jobList) ? jobList.map(job => ({ ...job, company })) : []
        )}
        renderItem={renderItem}
      />
    </div>
  );
};

export default App;
