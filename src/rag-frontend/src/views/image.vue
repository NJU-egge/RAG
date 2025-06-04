<script setup>
import { ref } from 'vue';
import { axios } from '../utils/request';
import { ElMessage } from 'element-plus';

const inputText = ref('');
const imageUrl = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const generateImage = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入文本');
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post('http://localhost:5000/api/generate-image', {
      text: inputText.value
    });

    if (response.data.image_url) {
      imageUrl.value = response.data.image_url;
    } else {
      ElMessage.error('生成图像失败');
    }
  } catch (error) {
    console.error('生成图像时出错:', error);
    ElMessage.error('生成图像时出错，请重试。');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <aside class="sidebar">
      <h2></h2>
    </aside>
    <main class="main">
      <div class="input-area">
        <textarea
            v-model="inputText"
            placeholder="请输入文本，用于生成图像..."
        ></textarea>
        <button @click="generateImage" :disabled="isLoading">
          {{ isLoading ? '生成中...' : '生成图像' }}
        </button>
      </div>

      <div v-if="imageUrl" class="image-result">
        <img :src="imageUrl" alt="生成的图像" />
      </div>
    </main>
  </div>
</template>



<style scoped>
.container {
  display: flex;
  height: 100vh;
  background: #f5f5f7;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 240px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #4a4a4a;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
  overflow-y: auto;
}

.input-area {
  background: rgba(255, 255, 255, 0.25);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin-bottom: 40px;
}

textarea {
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border-radius: 12px;
  border: none;
  resize: vertical;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  outline: none;
}

textarea::placeholder {
  color: #aaa;
}

button {
  align-self: flex-start;
  background: #6c5ce7;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 24px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 8px rgba(108, 92, 231, 0.3);
}

button:hover {
  opacity: 0.85;
}

button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.image-result img {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.image-result img:hover {
  transform: scale(1.01);
}

</style>