const jsonServer = require("json-server");
const http = require("http");
const { Server } = require("socket.io");

const server = jsonServer.create();
const router = jsonServer.router("db.json");

server.use((err, req, res, next) => {
  console.log("API Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Create a HTTP server
const httpServer = http.createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
  transports: ["websocket"],
});

// Middleware của jsonServer
server.use(jsonServer.defaults());
server.use(router);

const roomno = 1;
io.on("connection", (socket) => {
  socket.join("room-" + roomno);
  console.log("a user connected");

  socket.on("error", (err) => {
    console.log("Socket Error:", err);
  });

  socket.on("on-draw", (data) => {
    console.log({ data });
    io.in("room-" + roomno).emit("user-draw", data);
  });
});

// Lắng nghe trên cổng 3000
httpServer.listen(3000, () => {
  console.log("JSON Server and Socket.io are running on port 3000");
});
