import axios from 'axios';

export async function hostCheck(url: string): Promise<boolean> {
    try {
        await axios({
            url: url,
            method: 'GET',
            timeout: 2000,
            validateStatus: () => true,
            httpsAgent: new (require('https').Agent)({
                rejectUnauthorized: false,
            }),
        });

        return true;
    } catch (e) {
        return false;
    }
}
