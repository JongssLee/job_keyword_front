import React, { useState } from 'react';
import { Input, Radio, Button, Layout, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Header, Content } = Layout;
const { Search } = Input;

function MainPage() {
  const [searchType, setSearchType] = useState('all');
  const [jobs, setJobs] = useState([]);

  const handleSearch = async (value) => {
    try {
      let response;
      if (searchType === 'all' && !value) {
        response = await axios.get('http://localhost:8000/jobs');
      } else if (searchType === 'company') {
        response = await axios.get(`http://localhost:8000/jobs/${value}`);
      } else if (searchType === 'keyword') {
        response = await axios.get(`http://localhost:8000/jobs/search/${value}`);
      }
      setJobs(response.data);
    } catch (error) {
      message.error('Error fetching jobs');
    }
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/signup">
          <Button type="primary">Sign Up</Button>
        </Link>
      </Header>
      <Content style={{ padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <Radio.Group onChange={(e) => setSearchType(e.target.value)} value={searchType}>
            <Radio value="all">All</Radio>
            <Radio value="company">Company</Radio>
            <Radio value="keyword">Keyword</Radio>
          </Radio.Group>
        </div>
        <Search
          placeholder="Search for jobs"
          onSearch={handleSearch}
          style={{ width: 400 }}
          enterButton
        />
        <div style={{ marginTop: '20px' }}>
          {jobs.map((job, index) => (
            <div key={index}>
              <h3>{job.title}</h3>
              <p>Company: {job.company}</p>
              <p>Position: {job.details.직군}</p>
              <p>Experience: {job.details.신입_경력}</p>
              <p>Type: {job.details.근무형태}</p>
              <a href={job.details.link} target="_blank" rel="noopener noreferrer">View Job</a>
            </div>
          ))}
        </div>
      </Content>
    </Layout>
  );
}

export default MainPage;