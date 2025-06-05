<template>
  <div class="page-container">
    <section class="info-bar">
      <span>知识库共有 <strong>{{ numberFromBackend }}</strong> 条数据</span>
      <button class="icon-button" @click="downloadFile" title="下载数据">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
    </section>

    <section class="form-section">
      <input v-model="formData.name" placeholder="请输入名称" />
      <input v-model="formData.content" placeholder="请输入内容" />
      <button @click="submitForm">提交</button>
    </section>

    <section class="table-section">
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Content</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in data" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.content }}</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button :disabled="currentPage === 1" @click="gotoPage(currentPage - 1)">上一页</button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button :disabled="currentPage === totalPages" @click="gotoPage(currentPage + 1)">下一页</button>
        <input type="number" v-model.number="targetPage" :min="1" :max="totalPages" placeholder="页码" />
        <button @click="gotoPage(targetPage)">跳转</button>
      </div>
    </section>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import {ASK_MODULE, WARE_MODULE} from "../api/_prefix.js";
import { API_MODULE } from "../api/_prefix.js"

// 定义一个变量来存储从后端获取的数字
const numberFromBackend = ref('')

// 当组件挂载后获取后端数字
onMounted(async () => {
  try {
    const response = await fetch(`${WARE_MODULE}/count`) // 替换为实际的后端API地址
    const data = await response.json()
    numberFromBackend.value = data.number // 假设返回的数据包含一个number字段
  } catch (error) {
    console.error('Error fetching number from backend:', error)
  }
})

const downloadFile = async () => {
  try {
    const response = await fetch(`${API_MODULE}/download-xlsx`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KnowledgeBase.xlsx'; // 下载的文件名
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

const formData = ref({
  name: '',
  content: ''
});

const submitForm = async () => {
  try {
    const response = await fetch(`${API_MODULE}/kb/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.value.name,
        content: formData.value.content
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);
    alert('Data submitted successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert('Error submitting data!');
  }
};


const data = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const pageSize = ref(10);
const searchQuery = ref('');
const targetPage = ref(1);

const fetchData = async (page = 1) => {
  try {
    const response = await fetch(`${API_MODULE}/api/data?page=${page}&page_size=${pageSize.value}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    data.value = result.data;
    currentPage.value = result.page;
    totalPages.value = result.total_pages;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const gotoPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchData(page);
  } else {
    alert(`请输入有效的页码 (1-${totalPages.value})`);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.page-container {
  background: #f5f5f7;
  font-family: 'Inter', sans-serif;
  padding: 30px;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  padding: 16px 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.3s;
}

.icon-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.form-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-section input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  outline: none;
  background: rgba(255, 255, 255, 0.6);
}

.form-section button {
  padding: 10px 20px;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.form-section button:hover {
  background-color: #594ae2;
}

.table-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

thead {
  background: #f0f0f0;
}

th, td {
  padding: 14px 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

tbody tr:nth-child(even) {
  background: #fafafa;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-top: 1px solid #ddd;
}

.pagination input {
  width: 50px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.pagination button {
  background: #6c5ce7;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination button:hover {
  background: #594ae2;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

</style>