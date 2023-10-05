
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



describe("Conversations", async() => {
    
    it("should create a conversation",async() => {
        const participants = await User.count(2).create();
        
        const uuids = participants.map( participant => participant.uuid );
        const payload = {
            participants:uuids,
            name:faker.internet.domainName(),
        }
        const response = await request(domain)
        .post("/api/conversations")
        .send(payload);
        
        expect(response.status).toBe(200)
        
        const data = JSON.parse(response.text);

        expect(data.success).toBe(true)
        expect(data.conversation.uuid).toBeDefined();
        expect(data.conversation.participants.length).toBe(participants.length);
    });


    it("should list conversations a conversation", async() => {
        for(let i = 0; i < 10; i++){
            const participants = await User.count(2).create();
            const conversation = await ConversationModel.create({
                name:faker.internet.userName(),
                participants: participants
            });
        }

        const response = await request(domain)
        .get("/api/conversations");
        
        expect(response.status).toBe(200)
        
        const data = JSON.parse(response.text);
        
        expect(data.success).toBe(true)
        expect(data.conversations).toHaveLength(10)
    });


    it("should show a conversation", async() => {
        const participants = await User.count(2).create();
        const doc = await ConversationModel.create({
            name:faker.internet.userName(),
            participants: participants
        });
        const conversation = doc.toObject({flattenMaps:true, virtuals:true});
        const response = await request(domain)
        .get(`/api/conversations/${conversation.uuid}`);

        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.success).toBe(true);
        expect(conversation.uuid).toEqual(data.conversation.uuid);

    });

    
    it("should delete a conversation", async() => {
        const participants = await User.count(2).create();
        const doc = await ConversationModel.create({
            name:faker.internet.userName(),
            participants: participants
        });
        const conversation = doc.toObject({flattenMaps:true, virtuals:true});
        const response = await request(domain)
        .delete(`/api/conversations/${conversation.uuid}`);

        const conversations = await ConversationModel.find({});
        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.success).toBe(true);
        expect(conversations.length).toBe(0);

    });


    it("should add a participant to a conversation", async() => {
        const participants = await User.count(2).create();
        const doc = await ConversationModel.create({
            name:faker.internet.userName(),
            participants: participants
        });
        const conversation = doc.toObject({flattenMaps:true, virtuals:true});
        
        const extraParticipant = await User.count(1).create();

        const payload = {
            name:faker.internet.domainName(),
            participantsToAdd:[extraParticipant.uuid],
            participantsToRemove:[],
        };
        const response = await request(domain)
        .put(`/api/conversations/${conversation.uuid}`)
        .send(payload);

        const conversations = await ConversationModel.find({});
        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.success).toBe(true);
        expect(data.conversation.uuid).toBe(conversation.uuid);
        expect(data.conversation.participants).toHaveLength(3);

    });

    it("should add 2 participant to a conversation", async() => {
        const participants = await User.count(2).create();
        const doc = await ConversationModel.create({
            name:faker.internet.userName(),
            participants: participants
        });
        const conversation = doc.toObject({flattenMaps:true, virtuals:true});
        
        const extraParticipant1 = await User.count(1).create();
        const extraParticipant2 = await User.count(1).create();

        const payload = {
            name:faker.internet.domainName(),
            participantsToAdd:[extraParticipant1.uuid, extraParticipant2.uuid],
            participantsToRemove:[],
        };
        const response = await request(domain)
        .put(`/api/conversations/${conversation.uuid}`)
        .send(payload);

        const conversations = await ConversationModel.find({});
        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.success).toBe(true);
        expect(data.conversation.uuid).toBe(conversation.uuid);
        expect(data.conversation.participants).toHaveLength(4);

    });


    it("should add a new message to a conversation", async () => {
        const participants = [];
        for( let i = 0; i < 2; i++){
            const user = await UserModel.create({
                name:faker.internet.userName(),
            });
            participants.push(user);
        }
        const conversation = await Conversation.create({
            name:faker.internet.domainName(),
            participants:participants,
        });

        participants.forEach( p => {
            p.conversations.push(conversation);
            p.save();
        });

        const payload = {
            body:faker.lorem.lines(),
            author:participants[0]._uuid,
            conversation:conversation._uuid,
        };


        const response = await request(domain)
        .put(`/api/conversations/${conversation._uuid}/messages`)
        .send(payload)

        expect(response.status).toBe(200);
        const data = JSON.parse(response.text);
        
        expect(data.success).toBe(true);

    });
   


});
