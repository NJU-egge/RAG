//ask.ts
import { axios } from '../utils/request';
import { ResultVO, ASK_MODULE } from './_prefix';

// 创建对话请求体
type CreateTableRequest = {
    userId: string; // 用户ID
};

// 问答请求体
type AskRequest = {
    userId: string;
    tableId: string;   // 对话ID（称为tableId）
    question: string;  // 用户提问
};

// 问答返回体
export type AskResponse = {
    content: string[]; // AI 返回的答案
};

// 创建新对话（返回对话ID）
export const createTable = (data: CreateTableRequest) => {
    return axios.post<ResultVO<string>>(`${ASK_MODULE}/table/create`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
};


// 提交问题，获取回答
export const askQuestion = (data: AskRequest) => {
    return axios.post<ResultVO<AskResponse>>(`${ASK_MODULE}/ask`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
};


// 获取某用户的所有历史对话（返回tableId列表、对话名字列表）
export const getAllTablesByUserId = (userId: string) => {
    return axios.get<ResultVO<Array<{ tableId: string; tableName: string }>>>(`${ASK_MODULE}/table/user/${userId}`);
};


// 获取某个对话的完整内容（对话内容以问答list形式返回）
export const getTableContentById = (userId:string,tableId: string) => {
    return axios.get<ResultVO<string[]>>(`${ASK_MODULE}/table/${userId}/${tableId}`);
};

//
