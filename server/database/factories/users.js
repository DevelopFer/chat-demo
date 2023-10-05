import { faker } from '@faker-js/faker';
import { UserModel } from '../schemas/User';

const userClass = class {

    constructor(){
        this.total = 1;
    }

    count = ( number = 1 ) => {
        
        this.total = number;
        return this;

    }

    create = async () => {
        if( this.total === 1 ){
            const user = this.make();
            const newUser = await UserModel.create(user);
            return newUser.toObject({flattenMaps:true,virtuals:true});
        }
        const users = [];
        for( let i = 0; i < this.total; i++ ){
            const user = this.getUser();
            const newUser = await UserModel.create(user);
            users.push(newUser);
        }
        return users;
    }

    make = () => {
        if( this.total === 1 ){
            const user = this.getUser();
            return user;
        }
        const users = [];
        for( let i = 0; i < this.total; i++ ){
            const user = this.getUser();
            users.push(user);
        }
        return users;
    }

    getUser = () =>({
        name:faker.name.firstName(),
        online:false,
        socketId:faker.database.mongodbObjectId(),
    });

};

const User = new userClass();

export { User };