import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';
import express from 'express';
import Task from './models/Task.js';

mongoose.connect(DATABASE_URL),then(() => console.log('Connected to DB'));
 
const app = express();
app.use(express.json());

// asyncHandler는 또 다른 함수를 리턴 -> 오류 처리가 된 함수 
// 파라미터 handler = 함수 
function asyncHandler(handler) {
    return async function (req, res) {
        try {
            await handler(req, res);
        } catch (e) {
            if (e.name === 'ValidationError') {
                res.status(400).send({message: e.message });
            } else if (e.name === 'CastError') {
                res.status(404).send({ message: 'Cannot find given id. '});
            } else {
                res.status(500).send({ message: e.message });
            }
        }
    }
}

app.get('/tasks', asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터
     * - sort: 'oldest'인 경우 오래된 테스크 기준, 나머지 경우 새로운 태스크 기준
     * - count: 태스크 개수
     */
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    /**
     * 쿼리는 해당 메소드를 정렬 가능 (Task.find().sort().limit() 처럼)
     * sort 메소드 -> asc: 오름차순, desc: 내림차순 
     * limit 메소드 -> count가 0인 경우 모든 객체를 리턴 
     */

    const sortOption = { 
        createdAt: sort === 'oldest' ? 'asc' : 'desc' 
    };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
}));

/**
 * id가 존재하면 해당 데이터 출력
 * id가 존재하지 않으면 오류 문구 출력 (상태코드 : 404일 때)
 */

app.get('/tasks/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    /**
     * mongoose는 findById 메서드 제공 -> id에 해당하는 데이터 가져오기 
     * 데이터베이스에 데이터를 쓰거나 읽어오는 작업은 오래 걸려서
     * 비동기로 처리 -> async/await
     */
    const task = await Task.findById(id);
    if (task) {
        res.send(task);
    } else {
        res.status(404).send({ message: 'Cannot find given id. '});
    }
}));

app.post('/tasks', asyncHandler(async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
}));

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
        Object.keys(req.body).forEach((key) => {
            task[key] = req.body[key];
        });
        await task.save();
        res.send(task);
    } else {
        res.status(404).send({ message: 'Cannot find given id. '});
    }
}));

app.delete('/tasks/:id',  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id); 
    if (task) {
        res.sendStatus(204);
    } else {
        res.status(404).send({ message: 'Cannot find given id. '});
    }
}));

app.listen(3000, () => console.log('Server Started'));
