//user.ts
import { axios } from '../utils/request';
import { ResultVO, USER_MODULE } from './_prefix';

// 用户注册信息类型
type RegisterInfo = {
    username: string;     // 用户名
    password: string;     // 密码
};

// 用户登录信息类型
type LoginInfo = {
    username: string;     // 用户名
    password: string;     // 密码
};

// 登录返回的数据类型（示例中包含token）
export type LoginResponse = {
    token: string;        // 登录成功后返回的 token
    userId: string;       // 用户ID
    username: string;     // 用户名
};

// 注册用户
export const registerUser = (registerInfo: RegisterInfo) => {
    return axios.post<ResultVO<boolean>>(`${USER_MODULE}/register`, registerInfo, {
        headers: { 'Content-Type': 'application/json' }
    });
};

// 登录用户
export const loginUser = (loginInfo: LoginInfo) => {
    return axios.post<ResultVO<LoginResponse>>(`${USER_MODULE}/login`, loginInfo, {
        headers: { 'Content-Type': 'application/json' }
    });
};

// 登出接口
export const logoutUser = () => {
    return axios.post<ResultVO<boolean>>(`${USER_MODULE}/logout`, {}, {

        headers: { 'Content-Type': 'application/json' }
    });
};
