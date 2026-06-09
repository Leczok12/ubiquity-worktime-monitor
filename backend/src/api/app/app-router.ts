import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Ubiquity Worktime Monitor API!');
});

export { router as appRouter };
