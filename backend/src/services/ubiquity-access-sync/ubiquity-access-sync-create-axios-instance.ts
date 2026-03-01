import axios from 'axios';
import https from 'https';
import { config } from '../config';

export const createAxiosInstance = async () => {
    const apiUrl = await config.getValue('UBIQUITI_ACCESS_API_URL');
    if (!apiUrl || apiUrl.trim() === '') throw new Error('Ubiquity Access API URL is not configured');

    const apiKey = await config.getValue('UBIQUITI_ACCESS_API_KEY');
    if (!apiKey || apiKey.trim() === '') throw new Error('Ubiquity Access API Key is not configured');

    return axios.create({
        baseURL: apiUrl,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            accept: 'application/json',
            'content-Type': 'application/json',
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false, timeout: 15000 }),
        timeout: 15000,
    });
};
