import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';

const PromptEval = () => {
  // 定义状态变量来存储后端返回的数据
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      // 使用 axios 向后端发送 POST 请求
      const response = await axios.post('http://127.0.0.1:5000/submit', {
        message: message
      });

      // 设置响应数据
      setResponse(response.data);
      setError(null);
    } catch (err) {
      // 设置错误信息
      setError(err.message);
      setResponse(null);
    }
  };

  return (
      <div>
        <h1>Submit Message</h1>
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
        />
        <button onClick={handleSubmit}>Submit</button>
        {response ? (
            <div>
              <h2>Response from Server:</h2>
              <p>Received Message: {response.received_message}</p>
            </div>
        ) : error ? (
            <p>Error: {error}</p>
        ) : null}
      </div>
  );
};

export default PromptEval;