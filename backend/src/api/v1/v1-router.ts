import express from 'express';
const router = express.Router();

router.use('/', (req, res) => {
    res.send('Welcome to the Ubiquity Worktime Monitor v1API!');
});

export { router as v1Router };
