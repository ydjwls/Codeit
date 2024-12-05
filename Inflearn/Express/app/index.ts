import * as redis from "redis";
import { createApp } from "./app";

const PORT = 4000;


const startServer = async () => {
    const client = redis.createClient({ url: "redis://localhost:6379" });
    await client.connect();

    const app = createApp(client)
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    });
};

startServer();