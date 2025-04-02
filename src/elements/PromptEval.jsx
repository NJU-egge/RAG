import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';

const PromptEval = () => {
  // 定义状态变量来存储后端返回的数据
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 使用axios调用后端接口
    axios.get('http://127.0.0.1:5000/')
      .then(response => {
        // 请求成功，设置数据
        setData(response.data);
      })
      .catch(err => {
        // 请求失败，设置错误信息
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      {data ? (
        <div>
          <p>Name: {data.message}</p>
        
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PromptEval;