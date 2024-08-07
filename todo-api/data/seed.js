import mongoose from "mongoose";
import data from "./mock";
import Task from "../models/Task";
import { DATABASE_URL } from "../env";

mongoose.connect(DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close();
