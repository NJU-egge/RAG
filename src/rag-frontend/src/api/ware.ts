//ware.ts
import { axios } from '../utils/request';
import { ResultVO, WARE_MODULE } from './_prefix';

type KnowledgeInfo = {
    title: string; // 知识点标题
    content: string; // 知识点的具体内容
};

type KnowledgeResponse = {
    id: string; // 知识库条目的ID
    title: string; // 知识点的标题
    content: string; // 知识点的内容
    createTime: string; // 创建时间
};

// 获取所有知识库内容
export const getKnowledgeBase = () => {
    return axios.get<ResultVO<KnowledgeResponse[]>>(`${WARE_MODULE}/knowledge`);
};

// 添加内容到知识库
export const addKnowledge = (knowledgeInfo: KnowledgeInfo) => {
    return axios.post<ResultVO<boolean>>(`${WARE_MODULE}/knowledge`, knowledgeInfo, {
        headers: { 'Content-Type': 'application/json' }
    });
};
