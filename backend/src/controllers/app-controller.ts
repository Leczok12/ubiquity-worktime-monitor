import express, { Request, Response } from 'express';

import fs from 'node:fs';
import path from 'node:path';

const appController = () => {
    const publicPath = path.join(process.cwd(), 'public');

    const getAppStatic = express.static(publicPath, {});

    const getApp = async (req: Request, res: Response, next: express.NextFunction) => {
        try {
            const html = await fs.promises.readFile(path.join(publicPath, 'index.html'));
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).send(html);
        } catch (error) {
            return next(error);
        }
    };

    return { getAppStatic, getApp };
};

export { appController };
