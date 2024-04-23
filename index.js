const { Server } = require("socket.io");
require("dotenv").config()
const io = new Server({ cors: process.env.frontend_uRL });

let onlineUser = []

io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    socket.on("addNewUser", (userId) => {
        !onlineUser.some(user=>user.userId == userId) &&
        onlineUser.push({
            userId,
            socketId: socket.id
        })
    console.log(onlineUser)
    io.emit("getOnlineUsers",onlineUser)
    })

    socket.on("sendMessage", (message)=>{
        const user = onlineUser.find(user=>user.userId=== message.recipientId)
        if(user){
            io.to(user.socketId).emit("getMessage", message)
            io.to(user.socketId).emit("getNotification", {
                senderId:message.senderId,
                isRead:false,
                date: new Date()
            })

        }
    })


    socket.on("disconnect",()=>{
        onlineUser = onlineUser.filter(user=>user.socketId !== socket.id)
        io.emit("getOnlineUsers",onlineUser)
    })
});

io.listen(3000);
