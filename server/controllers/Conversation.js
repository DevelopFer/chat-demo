import { ConversationModel, MessageModel, UserModel } from "../database/schemas/index.js";
import { io } from "../server.js";

export class Conversation {

    store = async (req, res) => {
        try {
            const { name, participants } = req.body;
            if( ! name.length ) throw new Error("Name is required");
            if( ! participants.length || participants.length < 2 ) throw new Error("A pair of participants is required");
            const participantDocs = await this.resolveParticipants(participants);
            const conversation = await ConversationModel.create({
                name:name,
                participants:participantDocs
            });
            const newConversation = conversation.toObject({flattenMaps:true,virtuals:true});
            participantDocs.forEach(async (p) => {
                p.conversations.push(conversation);
                await p.save();
            });
            res.json({success:true, conversation:newConversation});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }
    }

    resolveParticipants = async (uuids) => {
        
        const participantsDocs = await UserModel.find({_uuid:{$in:uuids}}).exec();
        return participantsDocs;

    }

    index = async (req, res) => {
        try {
            const docs = await ConversationModel.find().populate('participants');
            const conversations = docs.map(doc => doc.toObject({ flattenMaps:true, virtuals:true}));
            res.json({success:true, conversations:conversations});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }
    }


    show = async ( req, res ) => {
        try {
            if( ! req.params.uuid) throw new Error("id is required");
            const conversation = await ConversationModel.findOne({_uuid:req.params.uuid}).populate('participants');
            if( ! conversation ) throw new Error("Conversation not found");
            res.json({success:true, conversation:conversation.toObject({flattenMaps:true, virtuals:true})});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }
    }

    destroy = async ( req, res ) => {
        try {
            if( ! req.params.uuid) throw new Error("id is required");
            await ConversationModel.deleteOne({_uuid:req.params.uuid});
            res.json({success:true});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }
    }

    update = async ( req, res ) => {
        try {
            const {name,participantsToAdd, participantsToRemove} = req.body;
            if( ! req.params.uuid) throw new Error("id is required");
            const conversation = await ConversationModel.findOne({_uuid:req.params.uuid});
            const remove       = await UserModel.find({_uuid:{$in:participantsToRemove}});
            const add          = await UserModel.find({_uuid:{$in:participantsToAdd}});
            add.forEach( newP => {
                conversation.participants.push(newP);
            });
            conversation.participants.filter((participant) => {
                return ! remove.includes(participant.toString());
            });
            conversation.name = name;
            conversation.save();
            res.json({success:true, conversation:conversation.toObject({flattenMaps:true, virtuals:true})});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }
    }


    addNewMessage = async ( req, res ) => {

        try {
            
            if( ! req.params.uuid ) throw new Error("Id is required");
            const { body, author } = req.body;
            if( ! body || ! author ) throw new Error("Body and Author are required");
            if( ! body.length || ! author.length ) throw new Error("Body and Author can not be empty");
            const user = await UserModel.findOne({_uuid:author})
            .populate({
                path:'conversations',
                match:{_uuid:{$eq:req.params.uuid}}
            })
            .exec();
            
            
            if( ! user ) throw new Error("User not found");
            if( ! user.conversations.length ) throw new Error("Conversation not found");
            const conversation = user.conversations[0];
            const message = await MessageModel.create({
                body:body,
                author:user,
                conversation:conversation,
            });
            conversation.messages.push(message);
            await conversation.save();
            const data = {
                body:message.body,
                author:user._uuid,
                conversation:conversation._uuid,
            }
            io.emit('newMessage',data);
            res.json({success:true});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }

    }


    getMessages = async ( req, res ) => {

        try {
            
            if( ! req.params.uuid ) throw new Error("Id is required");
            const conversation = await ConversationModel.findOne({_uuid:req.params.uuid})
            .populate({
                path:'messages',
                populate:{
                    path:'author',
                    model:'User',
                    select:'_uuid name'
                }
            }).sort({ createdAt: -1 });
            const messages = conversation.messages.map( message => {
                return ({
                    ...message.toObject({flattenMaps:true, virtuals:true}),
                    conversation_uuid:conversation.uuid
                })
    
            });
            res.json({success:true, messages});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }

    }


    getConversationByName = async (req, res) => {
        try {
            if( ! req.body.name ) throw new Error("Name is required");
            const uuids = req.body.name.split("#");
            const participants = await UserModel.find({_uuid:{$in:uuids}});
            const conversation = await ConversationModel.findOne({participants:participants});
            if( ! conversation ) throw new Error("Conversation not found");
            res.json({success:true, conversation:conversation.toObject({flattenMaps:true, virtuals:true})});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});    
        }
    }

};