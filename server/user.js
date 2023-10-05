import { UserModel } from "./database/schemas/index.js";

const users = [];


const setUserOnline = async ( uuid, socket ) => {
    try {
        const user  = await UserModel.findOne({_uuid:uuid});
        user.online = true;
        user.socketId = socket.id,
        user.save();
        const data = {
            uuid    : user._uuid.toString(),
            online  : user.online,
            username: user.name,
        };
        socket.broadcast.emit('userLoggedIn',data);
    } catch (error) {
        console.error(error);
    }
}

const setUserOffline = async ( socket ) => {
    try {
        const socketId = socket.id;
        const user  = await UserModel.findOne({socketId:socketId}).exec();
        user.online = false;
        user.save();
        const data = {
            uuid    : user._uuid.toString(),
            online  : user.online,
            username: user.name,
        };
        socket.broadcast.emit('userLoggedOut',data);
    } catch (error) {
        console.error(error);
    }
}

const getUsers = () => {
    return users;
}

export { setUserOnline, setUserOffline };