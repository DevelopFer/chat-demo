import express from "express";
import { User } from "../controllers/User.js";
import { Conversation } from "../controllers/Conversation.js";
const router = express.Router();


const UserController = new User();
const ConversationController = new Conversation();

router.post('/api/conversations', ConversationController.store)
.get('/api/conversations', ConversationController.index)
.get('/api/conversations/:uuid',ConversationController.show)
.delete('/api/conversations/:uuid',ConversationController.destroy)
.put('/api/conversations/:uuid',ConversationController.update)
.put('/api/conversations/:uuid/messages',ConversationController.addNewMessage)
.get('/api/conversations/:uuid/messages',ConversationController.getMessages)
.post('/api/conversations/history',ConversationController.getConversationByName);

router.post('/api/users', UserController.store)
.get('/api/users',UserController.index)
.post('/api/username',UserController.validateUsername)
.get('/api/users/:uuid',UserController.show)
.delete('/api/users/:uuid',UserController.destroy)
.get('/api/users/:uuid/conversations',UserController.listConversations);




export { router };

