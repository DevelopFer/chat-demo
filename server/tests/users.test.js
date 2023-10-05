
import {it, expect, describe, beforeEach, afterAll, expectTypeOf, beforeAll} from 'vitest';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { refreshDatabase } from './../database/index.js';
import { User } from '../database/factories/users.js';
import { Conversation } from '../database/factories/conversations.js';
import { ConversationModel } from '../database/schemas/Conversation.js';
import { UserModel } from '../database/schemas/User.js';

const DB_HOST="0.0.0.0:27017"
const DB="socket_test"
const domain = 'http://localhost:3010';

beforeEach( async ()=>{
    await refreshDatabase(DB,DB_HOST);
});



describe("Users", async() => {
    
    it("should create an user",async() => {
        
        const user = User.count(1).make();

        const response = await request(domain)
        .post("/api/users")
        .send(user);
        const data = JSON.parse(response.text);

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.user.uuid).toBeDefined();
    });


    it("should list users",async() => {
        
        await User.count(10).create();
        
        const response = await request(domain)
        .get("/api/users");

        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);

        expect(data.success).toBe(true)
        expect(data.users).toHaveLength(10);
    });


    it("should show an user",async() => {
        
        const user = await User.count().create();
        const response = await request(domain)
        .get(`/api/users/${user.uuid}`);

        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.success).toBe(true)
        expect(data.user).toBeDefined();
        expect(data.user.uuid).toBeDefined();
    });


    it("should delete an user",async() => {
        
        const user = await User.count().create();
        
        const response = await request(domain)
        .delete(`/api/users/${user.uuid}`);

        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.success).toBe(true)
    });
    

    it("should list conversations from an user", async() => {
        const p1 = await UserModel.create({
            name:faker.internet.userName(),
        })
        for( let i = 0; i < 6; i++){
            const p2 = await User.count().create();
            const conversation = await ConversationModel.create({
                name:faker.internet.domainName(),
                participants:[p1,p2._id]
            })
            p1.conversations.push(conversation);
        }
        p1.save();

        const response = await request(domain)
        .get(`/api/users/${p1.uuid}/conversations`);
        
        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.conversations).toHaveLength(6);
        
    });


    it("should return valid username",async() => {
        
        const payload = {
            username:faker.name.firstName(),
        };
        const response = await request(domain)
        .post("/api/username")
        .send(payload);

        expect(response.status).toBe(200)
        const data = JSON.parse(response.text);

        expect(data.success).toBe(true)
        expect(data.isValid).toBe(true);
    });


    it("should return invalid username",async() => {
        
        const username = faker.name.firstName();
        await UserModel.create({
            name:username,
        });

        const payload = {
            username:username
        };
        const response = await request(domain)
        .post("/api/username")
        .send(payload);

        expect(response.status).toBe(200)
        const data = JSON.parse(response.text);

        expect(data.success).toBe(true)
        expect(data.isValid).toBe(false);
    });

});
