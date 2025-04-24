import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import {Line} from "react-chartjs-2";
// 注册 Chart.js 的所有组件
Chart.register(...registerables);


const PromptEval = () => {


    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '指标变化折线图',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
        ],
    });

    const [newDataPoint, setNewDataPoint] = useState('');
    const [newLabel, setNewLabel] = useState('');

    const addDataPoint = () => {
        try {
            // 将输入的字符串转换为数字
            const dataPoint = parseFloat(response.received_message);
            if (isNaN(dataPoint)) {
                throw new Error('Invalid number');
            }

            // 添加新数据点和新标签到现有数据中
            setChartData(prevData => {
                const updatedDatasets = prevData.datasets.map(dataset => ({
                    ...dataset,
                    data: [...dataset.data, dataPoint],
                }));
                return {
                    ...prevData,
                    labels: [...prevData.labels, prompt],
                    datasets: updatedDatasets,
                };
            });

            // 清空输入框
            setNewDataPoint('');
            setNewLabel('');
        } catch (error) {
            console.error('Invalid data format:', error);
            alert('请输入有效的数字和标签');
        }
    };


  // 定义状态变量来存储后端返回的数据

    const [prompt, setPrompt] = useState('');
    const [param, setParam] = useState('')
    //const [message, setMessage] = useState('');
    const [question, setQuestion] = useState(null);
    const [response, setResponse] = useState('');
    const [context, setContext] = useState('')
    const [yourmetric, setYourmetric] = useState('')
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState('bleu'); // 默认选中bleu
    const [better, setBetter] = useState(null)

    const handleSubmit = async () => {
        try {
            // 使用 axios 向后端发送 POST 请求
            const response = await axios.post('https://4fa04919.r10.cpolar.top/prompt_eval', {
                question: question,
                context: context,
                metric: selectedOption,
                yourmetric : yourmetric
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

    const handleParamSubmit = async () => {
        try {
            // 使用 axios 向后端发送 POST 请求
            const response = await axios.post('https://4fa04919.r10.cpolar.top/prompt_fill', {
                prompt: prompt,
                param: param
            });

            // 设置响应数据
            setQuestion(response.data);
            setError(null);
        } catch (err) {
            // 设置错误信息
            setError(err.message);
            setResponse(null);
        }
    };

    const handleBetterSubmit = async () => {
        try {
            // 使用 axios 向后端发送 POST 请求
            const response = await axios.post('https://4fa04919.r10.cpolar.top/prompt_improve', {
                message: prompt
            });

            // 设置响应数据
            setBetter(response.data);
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
                <h1 className="text-2xl font-bold mb-4">Prompt评估与优化</h1>
                <div className="flex flex-wrap  -mx-4">
                    {/* 行 1 */}
                    <div className="w-full md:w-1/3 px-4 mb-4">
                        <div className="mb-4">
                        <textarea
                            value={prompt}
                            rows="6"
                            cols="50"
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="prompt"
                            className="w-full text-xl  rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-4 mb-4">
                        <div className="mb-4">
                        <textarea
                            value={param}
                            rows="6"
                            cols="50"
                            onChange={(e) => setParam(e.target.value)}
                            placeholder="填充数据"
                            className="w-full text-xl  rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-4 mb-4">
                        <div className="mb-4">
                        <textarea
                            value={question ? ` ${question.received_message}` : error ? `Error: ${error}` : ""}
                            readOnly
                            rows="6"
                            cols="50"
                            placeholder="填充后的提问"
                            className="w-full text-xl bg-blue-50 rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        </div>
                    </div>

                    <div className="w-full mb-4 flex flex-col gap-4">
                        <div>
                            <button
                                onClick={handleParamSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                填充
                            </button>
                        </div>

                    </div>

                    {/* 行 2 */}
                    <div className="w-full md:w-1/3 px-4 mb-4">
                        <div className="mb-4">
                        <textarea
                            value={yourmetric}
                            rows="6"
                            cols="50"
                            onChange={(e) => setYourmetric(e.target.value)}
                            placeholder="自定义指标"
                            className="w-full text-xl  rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-4 mb-4">
                        <div className="mb-4">
                        <textarea
                            value={context}
                            rows="6"
                            cols="50"
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="参考回答"
                            className="w-full text-xl  rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-4 mb-4">
                        <div className="mb-4">
                        <textarea
                            value={better ? ` ${better.received_message}` : error ? `Error: ${error}` : ""}
                            readOnly
                            rows="6"
                            cols="50"
                            placeholder="优化后的prompt"
                            className="w-full text-xl bg-blue-50 rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex flex-row justify-center gap-4">
                    <div>
                        <p>指标</p>
                        <select
                            value={selectedOption}
                            onChange={(e) => setSelectedOption((e.target.value))}

                        >
                            <option value="bleu">bleu</option>
                            <option value="faithfulness">faithfulness</option>
                            <option value="yourself">yourself</option>
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            评估
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={handleBetterSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            优化
                        </button>
                    </div>
                    <div className=" px-4 mb-4">
                        <div className="mb-4">
                        <textarea
                            value={response ? ` ${response.received_message}` : error ? `Error: ${error}` : ""}
                            readOnly
                            rows="1"
                            cols="5"
                            placeholder="分数"
                            className="w-full text-xl bg-blue-50 rounded-2xl p-2 border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        </div>
                    </div>
                    <div>
                        <button onClick={addDataPoint}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">添加数据点</button>

                    </div>
                </div>



                <div>
                    <div style={{ width: '800px', height: '400px', margin: '20px auto' }}>
                        <Line data={chartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptEval;