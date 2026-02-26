import axios from 'axios';
import https from 'https';
import configManager from '../config-manager';

export const createAxiosInstance = async () => {
    const apiUrl = await configManager.getValue('ubiquity-access-api-url');
    if (!apiUrl || apiUrl.trim() === '') throw new Error('Ubiquity Access API URL is not configured');

    const apiKey = await configManager.getValue('ubiquity-access-api-key');
    if (!apiKey || apiKey.trim() === '') throw new Error('Ubiquity Access API Key is not configured');

    return axios.create({
        baseURL: apiUrl,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            accept: 'application/json',
            'content-Type': 'application/json',
        },
        httpAgent: new https.Agent({ rejectUnauthorized: false, timeout: 15000 }),
        timeout: 15000,
    });
};
