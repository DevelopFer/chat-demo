import { faker } from '@faker-js/faker';
import {User} from "./../factories/users";
import { ConversationModel } from '../schemas/Conversation';

const conversationClass = class {

    constructor(){
        this.total = 1;
    }

    count = ( number = 1 ) => {
        
        this.total = number;
        return this;

    }

    create = async () => {

        const conversation = this.getConversation();
        const newConversation = await ConversationModel.create(conversation);
        
        return newConversation;
    }

    make = async (userDoc = null) => {
        let user = userDoc;
        if( ! user ) {
            user = await User.count(1).create();
        }
        if( this.total === 1){
            const conversation    = this.getConversation(user);
            return conversation;
        }
        const conversations = [];
        for( let i = 0; i < this.total; i++ ){
            const conversation = this.getConversation(user);
            conversations.push(conversation);
        }
        return conversations;
    }

    getConversation = (user) => ({
        name: faker.internet.domainName(),
        user: user
    });

};

const Conversation = new conversationClass();

export { Conversation };