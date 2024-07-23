import React, { useState, useEffect } from 'react';
import { Form, Input, Button, List, message } from 'antd';
import axios from 'axios';

const KeywordForm = ({ token, onKeywordSearch }) => {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await axios.get('/api/auth/users/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userKeywords = response.data.keywords || [];
      setKeywords(Array.isArray(userKeywords) ? userKeywords : []);
    } catch (error) {
      message.error('Failed to fetch keywords');
    }
  };

  const handleAddKeyword = async () => {
    if (!newKeyword) return;
    const updatedKeywords = [...keywords, newKeyword];
    try {
      await axios.put('/api/users/keywords', { keywords: updatedKeywords }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKeywords(updatedKeywords);
      setNewKeyword('');
      message.success('Keyword added');
    } catch (error) {
      message.error('Failed to add keyword');
    }
  };

  const handleDeleteKeyword = async (keyword) => {
    try {
      await axios.delete(`/api/users/keywords/${keyword}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKeywords(keywords.filter(kw => kw !== keyword));
      message.success('Keyword deleted');
    } catch (error) {
      message.error('Failed to delete keyword');
    }
  };

  return (
    <div>
      <Form layout="inline" onFinish={handleAddKeyword}>
        <Form.Item>
          <Input
            placeholder="Enter keyword"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Add</Button>
        </Form.Item>
      </Form>
      <List
        bordered
        dataSource={keywords}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => onKeywordSearch(item)}>Search</Button>,
              <Button type="link" danger onClick={() => handleDeleteKeyword(item)}>Delete</Button>
            ]}
          >
            {item}
          </List.Item>
        )}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default KeywordForm;
