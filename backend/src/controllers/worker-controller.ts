import { Request, Response } from 'express';
import { ApiError } from 'src/types/api-error';

const getWorker = async (req: Request, res: Response) => {
    const { id } = req.params;

    throw new ApiError(404, `User with id ${id}, not exist.`);

    const users = {
        xd: id,
    };
    res.json(users);
};

export { getWorker };
