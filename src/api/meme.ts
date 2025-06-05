// image.ts
import { axios } from '../utils/request';
import { ResultVO, IMAGE_MODULE } from './_prefix';

// 图像生成请求参数类型
export type GenerateImageRequest = {
    text: string;         // 生成图像的描述文本
};

// 图像生成响应数据类型
export type GenerateImageResponse = {
    image_url: string;    // 生成的图像URL
};

/**
 * 生成图像接口
 * @param params 生成图像请求参数
 * @returns Promise<ResultVO<GenerateImageResponse>>
 */
export const generateImage = (params: GenerateImageRequest) => {
    return axios.post<ResultVO<GenerateImageResponse>>(
        `${IMAGE_MODULE}/generate`,
        params,
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
};