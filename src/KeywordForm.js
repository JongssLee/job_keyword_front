import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Tag } from 'antd';
import axios from 'axios';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

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
          <Button type="primary" htmlType="submit" >Add</Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: '20px' }}>
        {keywords.map((item) => (
          <Tag
            key={item}
            color="default"
            style={{ borderRadius: '16px', padding: '4px 10px', marginRight: '8px', marginBottom: '8px', display: 'inline-flex', alignItems: 'center' }}
          >
            <span style={{ cursor: 'pointer' }} onClick={() => onKeywordSearch(item)}>{item}</span>
            <CloseOutlined onClick={() => handleDeleteKeyword(item)} style={{ marginLeft: '8px', cursor: 'pointer' }} />
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default KeywordForm;
