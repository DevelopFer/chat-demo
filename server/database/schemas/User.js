import mongoose, { Model, model } from "mongoose";
import {v4} from "uuid";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _uuid : {
        type:Schema.Types.UUID,
        default:() => v4()
    },
    name: {
        type:String,
        unique:true,
        required:true
    },
    online:{
        type:Boolean,
        default:false,
    },
    socketId:{
        type:String,
        unique:true,
    },
    conversations: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Conversation",
        }
    ],
    deletedAt:{
        type:Date,
        default:null
    },
},{timestamps:true, collection:"users"});





UserSchema.virtual('id').get(function(){
    return this._id.toString();
});


UserSchema.virtual('uuid').get(function(){
    return this._uuid.toString();
});


// UserSchema.pre('find',softDeleteMiddleware);
// UserSchema.pre('findOne',softDeleteMiddleware);



const UserModel = model("User",UserSchema);

export { UserModel };