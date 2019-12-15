import express from "express";
import path from "path";

type Position = {
    x: number;
    y: number;
};

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const positions: Position[] = [];

app.use(express.static(path.resolve(__dirname, "./public")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./public/index.html"));
});

io.on('connection', (socket: any) => {
    const p = { x: 0, y: 0 };
    const i = positions.push(p) - 1;

    io.emit("update", positions);
    socket.on('message', (msg: string, { x, y }: Position) => {
        if (msg === "move") {
                positions[i] = {
                    x: positions[i].x + x,
                    y: positions[i].y + y
                };
                io.emit("update", positions);
        }
    });

    socket.on('disconnect', () => {
        positions.splice(positions.indexOf(p), 1);
        io.emit("update", positions);
    });
});

server.listen(8080, () => console.log("Server listening on http://localhost:8080"));