<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import {
  createTable,
  getAllTablesByUserId,
  getTableContentById,
  askQuestion,
} from '../api/ask';

const userId = ref(localStorage.getItem('userId') || '');
const conversations = ref<{ tableId: string; tableName: string }[]>([]);
const activeTableId = ref('');
const chatHistory = ref<{ sender: 'user' | 'ai'; text: string }[]>([]);
const input = ref('');
const loading = ref(false);

const activeConversationName = computed(() => {
  const found = conversations.value.find(c => c.tableId === activeTableId.value);
  return found ? found.tableName : 'New Chat';
});

const loadConversations = async () => {
  const res = await getAllTablesByUserId(userId.value);
  if (res.data.code === '200') {
    conversations.value = res.data.data.map((item) => ({
      tableId: String(item.tableId),
      tableName: item.tableName?.trim() || 'New Chat',
    }));
  } else {
    ElMessage.error(res.data.msg || '获取历史对话失败');
  }
};

const loadChatHistory = async (tableId: string) => {
  const res = await getTableContentById(userId.value, tableId);
  if (res.data.code === '200') {
    activeTableId.value = tableId;
    chatHistory.value = res.data.data.map((item: string, index: number) => ({
      sender: index % 2 === 0 ? 'user' : 'ai',
      text: item,
    }));
  } else {
    ElMessage.error(res.data.msg || '加载对话内容失败');
  }
};

const handleSend = async () => {
  const question = input.value.trim();
  if (!question || !activeTableId.value) return;

  chatHistory.value.push({ sender: 'user', text: question });
  input.value = '';
  loading.value = true;

  try {
    const res = await askQuestion({ userId: userId.value, tableId: activeTableId.value, question });
    if (res.data.code === '200') {
      res.data.data.content.forEach((text: string) => {
        chatHistory.value.push({ sender: 'ai', text });
      });

      const current = conversations.value.find(c => c.tableId === activeTableId.value);
      if (current && current.tableName === 'New Chat') await loadConversations();
    } else {
      ElMessage.error(res.data.msg || '提问失败');
    }
  } catch (e) {
    ElMessage.error('请求出错');
  } finally {
    loading.value = false;
  }
};

const handleNewConversation = async () => {
  const res = await createTable({ userId: userId.value });
  if (res.data.code === '200') {
    await loadConversations();
    await loadChatHistory(res.data.data); // 切换到新对话
  } else {
    ElMessage.error('新建对话失败');
  }
};

onMounted(async () => {
  await loadConversations();
  if (conversations.value.length > 0) await loadChatHistory(conversations.value[0].tableId);
});
</script>



<template>
  <div class="chat-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>会话</h2>
        <button class="circle-btn" @click="handleNewConversation">＋</button>
      </div>
      <div
          class="chat-list-item"
          :class="{ active: item.tableId === activeTableId }"
          v-for="item in conversations"
          :key="item.tableId"
          @click="loadChatHistory(item.tableId)"
      >
        {{ item.tableName }}
      </div>
    </aside>
    <main class="main">
      <div class="chat-header">
        {{ activeConversationName }}
      </div>
      <div class="chat-body">
        <div
            class="message"
            :class="{ self: msg.sender === 'user' }"
            v-for="(msg, index) in chatHistory"
            :key="index"
        >
          {{ msg.text }}
        </div>
      </div>
      <div class="chat-input">
        <input v-model="input" @keydown.enter.prevent="handleSend" placeholder="输入消息..." />
        <button @click="handleSend" :disabled="loading">发送</button>
      </div>
    </main>
  </div>
</template>






<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background: #f5f5f7;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 260px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.circle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: #6c5ce7;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  transition: background 0.3s ease, transform 0.2s ease;
}

.circle-btn:hover {
  background: rgba(108, 92, 231, 0.2);
  transform: scale(1.05);
}


.chat-list-item {
  padding: 10px 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.chat-list-item:hover {
  background: rgba(108, 92, 231, 0.11);
}

.chat-list-item.active {
  background: rgba(108, 92, 231, 0.34);
  color: rgb(250, 250, 230);
  font-weight: 500;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
}

.message {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  word-break: break-word;
  white-space: pre-wrap;
}

.message.self {
  align-self: flex-end;
  background: rgba(108, 92, 231, 0.63);
  color: #fff;
}

.chat-input {
  padding: 20px;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.chat-input input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.chat-input button {
  background: #6c5ce7;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.3s;
}

.chat-input button:hover {
  opacity: 0.8;
}
</style>
