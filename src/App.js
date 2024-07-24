import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Form, Typography, message, Card, Row, Col, Modal, Pagination } from 'antd';
import axios from 'axios';
import Layout from './Layout';
import KeywordForm from './KeywordForm';

const { Option } = Select;
const { Text, Title } = Typography;

const App = ({ token, setToken }) => {
  const [jobs, setJobs] = useState([]);
  const [searchType, setSearchType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const fetchJobs = async (url = '/api/jobs') => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      console.log('Fetched data:', response.data);
      const jobsArray = Array.isArray(response.data) 
        ? response.data 
        : Object.entries(response.data).flatMap(([company, jobList]) =>
            Array.isArray(jobList) ? jobList.map(job => ({ ...job, company })) : []
          );
      setJobs(jobsArray);
      setLoading(false);
    } catch (error) {
      message.error('Error fetching jobs');
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    if (token) {
      try {
        const response = await axios.get('/api/auth/users/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  useEffect(() => {
    fetchJobs();  // 초기 로딩 시 모든 jobs 가져오기
  }, []);

  useEffect(() => {
    fetchUser();
  }, [token]);

  const handleSearch = (keyword = '') => {
    let url = '/api/jobs';
    if (searchType === 'company') {
      url = `/api/jobs/${searchTerm}`;
    } else if (searchType === 'keyword' || keyword) {
      url = `/api/jobs/search/${keyword || searchTerm}`;
    }
    fetchJobs(url);
  };

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const renderItem = (item) => {
    const { 공고제목 = '', 직군 = '', 신입_경력 = '', 근무형태 = '', 링크 = '' } = item;

    return (
      <Col xs={24} sm={12} md={8} lg={6} xl={6} key={item.id || item.링크}>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0 }}>{공고제목}</Title>
              <Button type="primary" href={링크} target="_blank" rel="noopener noreferrer">
                Go to Link
              </Button>
            </div>
          }
          style={{ marginBottom: '20px', height: '100%', cursor: 'pointer' }}
          bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          onClick={() => handleCardClick(item)}
        >
          <div>
            <p><Text strong style={{ fontSize: '16px' }}>Company:</Text> {item.company}</p>
            <p><Text strong style={{ fontSize: '16px' }}>Position:</Text> {직군}</p>
            <p><Text strong style={{ fontSize: '16px' }}>Experience:</Text> {신입_경력}</p>
            <p><Text strong style={{ fontSize: '16px' }}>Employment Type:</Text> {근무형태}</p>
          </div>
        </Card>
      </Col>
    );
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = jobs.slice(startIndex, endIndex);

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
        {paginatedJobs.map(renderItem)}
      </Row>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={jobs.length}
        onChange={handlePageChange}
        style={{ textAlign: 'center', marginTop: '20px' }}
      />
      {selectedJob && (
        <Modal
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedJob.공고제목}
              <Button 
                type="primary" 
                href={selectedJob.링크} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ marginRight: '20px' }}
              >
                Go to Link
              </Button>
            </div>
          }
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
          width={800}
        >
          <div>
            <p><Text strong>Company:</Text> {selectedJob.company}</p>
            <p><Text strong>Position:</Text> {selectedJob.직군}</p>
            <p><Text strong>Experience:</Text> {selectedJob.신입_경력}</p>
            <p><Text strong>Employment Type:</Text> {selectedJob.근무형태}</p>
            <ul>
              {selectedJob.직무내용.map((content, index) => (
                <li key={index}>{content}</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default App;
