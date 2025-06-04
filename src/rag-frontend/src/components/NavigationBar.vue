<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { loginUser, registerUser, logoutUser } from '../api/user';
import { useRouter } from 'vue-router';
import avatarImg from '../assets/avatar.jpg'


const router = useRouter();

// 登录状态 & 用户信息
const isLoggedIn = ref(false);
const username = ref('');
const token = ref('');
const userId = ref('');

// 控制弹窗 & 表单切换
const dialogVisible = ref(false);
const isLoginMode = ref(true);

// 登录 & 注册表单数据
const loginForm = ref({ username: '', password: '' });
const registerForm = ref({ username: '', password: '' });

// 尝试从 localStorage 恢复登录状态
onMounted(() => {
  const storedToken = localStorage.getItem('token');
  const storedUsername = localStorage.getItem('username');
  const storedUserId = localStorage.getItem('userId');

  if (storedToken && storedUsername && storedUserId) {
    token.value = storedToken;
    username.value = storedUsername;
    userId.value = storedUserId;
    isLoggedIn.value = true;
  }
});

// 登录方法
const handleLogin = async () => {
  const { username: u, password: p } = loginForm.value;

  if (!/^\d{11}$/.test(u)) {
    ElMessage.warning('手机号必须为11位数字');
    return;
  }

  if (!/^\d{6}$/.test(p)) {
    ElMessage.warning('密码必须为6位数字');
    return;
  }

  try {
    const res = await loginUser({ username: u, password: p });
    const { code, msg, data } = res.data;

    if (code === '200') {
      const { token: tk, username: name, userId: id } = data;
      token.value = tk;
      username.value = name;
      userId.value = id;
      isLoggedIn.value = true;
      dialogVisible.value = false;

      localStorage.setItem('token', tk);
      localStorage.setItem('username', name);
      localStorage.setItem('userId', id);

      ElMessage.success(msg);
      location.reload();
    } else {
      ElMessage.error(msg);
    }
  } catch (err) {
    ElMessage.error('登录请求失败');
  }
};


// 注册方法
const handleRegister = async () => {
  const { username: u, password: p } = registerForm.value;

  if (p.length !== 6 || !/^\d{6}$/.test(p)) {
    ElMessage.warning('密码必须为6位数字');
    return;
  }

  if (!/^\d{11}$/.test(u)) {
    ElMessage.warning('手机号必须为11位数字');
    return;
  }

  try {
    const res = await registerUser({ username: u, password: p });
    const { code, msg, data } = res.data;

    if (code === '200' && data === true) {
      ElMessage.success(msg);       // 注册成功
      isLoginMode.value = true;     // 切换为登录模式
    } else {
      ElMessage.error(msg);         // 注册失败或已存在
    }
  } catch (err) {
    ElMessage.error('注册请求失败');
  }
};

// 登出方法
const handleLogout = async () => {
  await logoutUser();
  isLoggedIn.value = false;
  token.value = '';
  username.value = '';
  userId.value = '';

  // 清除 localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('chatHistory');  // ✅ 清除历史对话


  ElMessage.success('已登出');
  router.push('/');
  location.reload();
};

</script>




<template>
  <div class="nav-bar-container">
    <el-menu class="nav-bar" mode="horizontal" :router="true">
      <div class="left-menu">  <!-- 左侧菜单容器 -->
        <el-menu-item index="/dashboard">RAG问答</el-menu-item>
        <el-menu-item index="/image">表情包</el-menu-item>
        <el-menu-item v-if="isLoggedIn && username === '00000000000'" index="/ware">知识库</el-menu-item>
      </div>

      <div class="right-actions">
        <!-- 未登录时 -->
        <el-button v-if="!isLoggedIn" @click="dialogVisible = true" type="primary" text>登录 | 注册</el-button>

        <!-- 登录后 -->
        <el-dropdown v-else @command="handleLogout">
          <span class="el-dropdown-link">
            <el-avatar :size="55" fit="cover" :src="avatarImg" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-menu>

    <!-- 登录注册弹窗 -->
    <el-dialog v-model="dialogVisible" title="欢迎使用" width="400px">
      <div style="display: flex;">
        <div style="flex: 1; padding-right: 10px;" v-show="isLoginMode">
          <el-form :model="loginForm">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="loginForm.password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="flex: 1; padding-left: 10px;" v-show="!isLoginMode">
          <el-form :model="registerForm">
            <el-form-item label="用户名">
              <el-input v-model="registerForm.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="registerForm.password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleRegister">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button text @click="isLoginMode = !isLoginMode">
          {{ isLoginMode ? '还没有账号？注册' : '已有账号？登录' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>






<style scoped>
.nav-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-bar {
  flex:1;
  display: flex;
  justify-content: space-between; /* 左右两侧分开 */
}

.left-menu {
  display: flex; /* 保持左侧菜单项水平排列 */
}

.right-actions {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

/* 修复 Element UI 菜单项的默认边距 */
.el-menu--horizontal > .el-menu-item {
  margin: 0 !important;
}

.el-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

</style>
