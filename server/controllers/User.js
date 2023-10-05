import { ConversationModel, UserModel } from "./../database/schemas/index.js";

export class User {

    store = async (req,res) => {
        try {
            const user    = await UserModel.create(req.body);
            const newUser = user.toObject({flattenMaps:true,virtuals:true});
            res.json({success:true, user:newUser});            
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});            
        }
    }

    index = async(req, res) => {
        try {
            const users = await UserModel.find();
            res.json({success:true, users:users.map(user => user.toObject({flattenMaps:true,virtuals:true}))})
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});
        }
    }


    show = async(req, res) => {
        try {
            const user = await UserModel.findOne({_uuid:req.params.uuid});
            if( ! user ) throw new Error("User not found");
            res.json({success:true, user:user.toObject({flattenMaps:true,virtuals:true})})
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});
        }
    }


    destroy = async(req, res) => {
        try {
            const user = await UserModel.deleteOne({_uuid:req.params.uuid});
            if( ! user ) throw new Error("User not found");
            res.json({success:true});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});
        }
    }


    listConversations = async (req,res) => {
        try {
            const user = await UserModel.findOne({_uuid:req.params.uuid}).populate('conversations');
            if( ! user ) throw new Error("User not found");
            const conversations = user.conversations.map( conversation => conversation.toObject({flattenMaps:true,virtuals:true}));
            res.json({success:true, conversations:conversations});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});
        }
    }


    validateUsername = async ( req, res ) => {
        try {
            const { username } = req.body;
            if( ! username ) throw new Error("Username is required");
            const user = await UserModel.findOne({name:username});
            if( ! user ){
                return res.json({success:true, isValid:true});
            }
            const userDoc = {
                uuid:user._uuid,
                username:user.name
            };
            return res.json({success:true, isValid:false, user:userDoc});
        } catch (error) {
            console.error(error);
            res.json({error:error.message,success:false});
        }
    }

};