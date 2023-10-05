import mongoose, { Model, model } from "mongoose";
import {v4} from "uuid";

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    _uuid : {
        type:Schema.Types.UUID,
        default:() => v4()
    },
    name: {
        type:String,
        required:true
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
        }
    ],
    deletedAt:{
        type:Date,
        default:null
    },
},{timestamps:true, collection:"conversations"});





ConversationSchema.virtual('id').get(function(){
    return this._id.toString();
});


ConversationSchema.virtual('uuid').get(function(){
    return this._uuid.toString();
});


// UserSchema.pre('find',softDeleteMiddleware);
// UserSchema.pre('findOne',softDeleteMiddleware);



const ConversationModel = model("Conversation",ConversationSchema);

export { ConversationModel };