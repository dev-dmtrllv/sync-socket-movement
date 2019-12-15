import io from "socket.io-client";

type Position = {
    x: number;
    y: number;
};

let socket = io();

const canvas: HTMLCanvasElement = document.getElementById("canvas") as any;
const ctx = canvas.getContext("2d")!;

const reset = () =>
{
    canvas.style.width = (canvas.width = window.innerWidth) + "px";
    canvas.style.height = (canvas.height = window.innerHeight) + "px";
}

reset();
window.addEventListener("resize", reset);

let players: Position[] = [];

const update = (x: number, y: number) => {
    console.log("update", x, y)
    socket.send("move", { x, y });
}

socket.on("update", (p: any) => {
    players = p;
});

let keys: number[] = [];

window.addEventListener("keydown", (e) => {
    if (!keys.includes(e.keyCode))
        keys.push(e.keyCode);
});

window.addEventListener("keyup", (e) => {
    if (keys.includes(e.keyCode))
        keys.splice(keys.indexOf(e.keyCode), 1);
});

const render = () => {
    let x = 0;
    let y = 0;

    if (keys.includes(37) && !keys.includes(39))
        x = -5;
    else if (!keys.includes(37) && keys.includes(39))
        x = 5;

    if (keys.includes(40) && !keys.includes(38))
        y = -5;
    else if (!keys.includes(40) && keys.includes(38))
        y = 5;

    if (x !== 0 || y !== 0)
        update(x, y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.transform(1, 0, 0, -1, 0, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    players.forEach(({ x, y }) => {
        console.log(x, y)
        ctx.fillRect(x - 25, y - 25, 50, 50);
    });
    ctx.restore();
    requestAnimationFrame(render);
}

render();