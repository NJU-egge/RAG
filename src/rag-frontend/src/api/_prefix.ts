//prefix.tx
//总api
export const API_MODULE = 'http://10.54.15.144:5000'

//登录注册模块
export const USER_MODULE = `${API_MODULE}/user`
//问答模块
export const ASK_MODULE = `${API_MODULE}/ask`
//知识库模块
export const WARE_MODULE = `${API_MODULE}/kb`

export type ResultVO<T> = {
    code: string;
    msg: string;
    data: T;
};