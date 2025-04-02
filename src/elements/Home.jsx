import React, { useState } from 'react';
import axios from 'axios';

// 初始界面，含有登录、注册按钮
const Home = () => {


  return (
    <div>

      <div>
        <div>
          <h1>Code_crafts RAG</h1>
        </div>
        <div>
          <a href="/RAG/#/rag_application" className="text-blue-300 font-bold text-2xl">RAG应用</a>
          <a href="/RAG/#/rag_eval" className="text-blue-300 font-bold text-2xl">RAG评估</a>
          <a href="/RAG/#/prompt_eval" className="text-blue-300 font-bold text-2xl">Prompt评估</a>
        </div>
      </div>
    </div>


  );

  
}




export default Home;

