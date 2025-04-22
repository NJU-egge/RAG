import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

const RagEval = () => {
    const [chartData, setChartData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sample Data',
                data: [65, 59, 80, 81, 56, 55, 40],
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
            const dataPoint = parseFloat(newDataPoint);
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
                    labels: [...prevData.labels, newLabel],
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

    return (
        <div>
            <h1>Rag评估</h1>
            <div>
                <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="输入新标签"
                />
                <input
                    type="text"
                    value={newDataPoint}
                    onChange={(e) => setNewDataPoint(e.target.value)}
                    placeholder="输入新数据点"
                />
                <button onClick={addDataPoint}>添加数据点</button>
            </div>
            <div style={{ width: '800px', height: '400px', margin: '20px auto' }}>
                <Line data={chartData} />
            </div>
        </div>
    );
};

export default RagEval;