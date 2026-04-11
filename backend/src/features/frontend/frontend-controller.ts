import express, { Request, Response } from 'express';

import fs from 'node:fs';
import path from 'node:path';

const frontendDistPath = path.join(__dirname, '../../../../frontend');

export const getFrontendStatic = express.static(frontendDistPath, {});

export const getFrontend = async (req: Request, res: Response, next: express.NextFunction) => {
    try {
        const html = await fs.promises.readFile(path.join(frontendDistPath, 'index.html'));
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
    } catch (error) {
        return next(error);
    }
};
