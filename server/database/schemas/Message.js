import mongoose, { Model, model } from "mongoose";
import {v4} from "uuid";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    _uuid : {
        type:Schema.Types.UUID,
        default:() => v4()
    },
    conversation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    body: {
        type:String,required:true
    },
    deletedAt:{
        type:Date,
        default:null
    },
},{timestamps:true, collection:"messages"});


MessageSchema.virtual('id').get(function(){
    return this._id.toString();
});


MessageSchema.virtual('uuid').get(function(){
    return this._uuid.toString();
});


// UserSchema.pre('find',softDeleteMiddleware);
// UserSchema.pre('findOne',softDeleteMiddleware);



const MessageModel = model("Message", MessageSchema);

export { MessageModel };