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
      const response = await axios.post('https://2264b119.r10.cpolar.top', {
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
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Prompt评估</h1>
                <div className="mb-4">
          <textarea
              value={message}
              rows="4"
              cols="50"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="w-full bg-blue-50 rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
                </div>
                <div className="mb-4">
          <textarea
              value={response ? ` ${response.received_message}` : error ? `Error: ${error}` : ""}
              readOnly
              rows="4"
              cols="50"
              placeholder="Waiting for response..."
              className="w-full bg-blue-50 rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
          />
                </div>
                <div>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptEval;