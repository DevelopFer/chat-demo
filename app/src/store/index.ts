import { API } from "@/api/API";
import { createStore } from "vuex";


const store = createStore({
    state:
    {
        count:0,
        conversation:null as {[key:string]:string|IMessage[]} | null,
        users:[] as {[key:string]:string}[],
    },
    mutations:{
        handleUserStatus(state, payload){
            if( ! payload ) return;
            const index = state.users.findIndex( user => user.uuid === payload.uuid );
            if( index === -1){
                state.users.push({
                    uuid         : payload.uuid,
                    prependAvatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
                    title        : payload.username,
                    subtitle     : `<span class="text-${payload.online ? 'success':'info'}">
                      <strong>${payload.online?'On Line':'Offline'}</strong>
                    </span>`,
                });
            }
            state.users[index].subtitle = `<span class="text-${payload.online ? 'success':'info'}">
                <strong>${payload.online?'On Line':'Offline'}</strong>
                </span>`;
            state.users.sort((a:{[key:string]:string}, b:{[key:string]:string}) => {
                const nameA = a.title.toUpperCase();
                const nameB = b.title.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
        },
        addUser(state, user){
            state.users.push(user);
        },
        setUsers(state,users){
            state.users = users;
        },
        updateUserStatus(state, data:{[key:string]:string}){
            const user = state.users.find( (user:{[key:string]:string}) => user.uuid === data.uuid );
            if( ! user ) return;
            user.online = data.online;
        },
        setConversation(state, conversation){
            state.conversation = conversation;
        }
    },
    actions:{
        async fetchConversationByName({commit}, uuid){
            let conversation = null;
            try {
                const myUuid = sessionStorage.getItem("uuid");
                const name = `${uuid}#${myUuid}`
                const response = await API.post(`/api/conversations/history`,{name:name});
                if( ! response.data.success ){
                    throw new Error(response.data.error);
                }
                conversation = response.data.conversation;
            } catch (error) {
                console.error(error);
            }finally{
                return conversation;
            }
        },

        async createConversation({commit}, uuid){
            let conversation = null;
            try {
                const myUuid = sessionStorage.getItem('uuid');
                const payload = {
                    participants:[uuid, myUuid],
                    name:`${uuid}#${myUuid}`
                }
                const response = await API.post(`/api/conversations`,payload);
                if( ! response.data.success ){
                    throw new Error(response.data.error);
                }
                conversation = response.data.conversation;
            } catch (error) {
                console.error(error);
            }finally{
                return conversation;
            }
        },


        async resolveMessages({commit, state}){
            try {
                if( ! state.conversation ) return null;
                const response = await API.get(`/api/conversations/${state.conversation.uuid}/messages`);
                if( ! response.data.success ){
                    throw new Error(response.data.error);
                }
                response.data.messages.forEach( (message:any) => {
                    if( ! state.conversation!.messages ) {
                        state.conversation!.messages = [];
                    }
                    if( typeof state.conversation!.messages === 'string' ) return;
                    state.conversation!.messages.push({
                        mymessage:message.author.uuid === sessionStorage.getItem('uuid'),
                        body:message.body,
                        author:message.author.uuid,
                        conversation:message.conversation_uuid,
                   } as IMessage) 
                });
            } catch (error) {
                console.error(error);
            }
        },

        async resolveConversation({commit, dispatch}, conversationUuid){
            let conversation = await dispatch('fetchConversationByName',conversationUuid);
            if( ! conversation ) {
                conversation = await dispatch('createConversation',conversationUuid);
            }
            const { uuid } = conversation;
            await commit('setConversation',{uuid});
            await dispatch("resolveMessages");
        },

        async sendMessage({commit,state},payload){
            try {
                
                const response = await API.put(`/api/conversations/${state.conversation!.uuid}/messages`, payload);
                if( ! response.data.success ){
                    throw new Error(response.data.error);
                }
                if( ! (state.conversation!.messages) ) {
                    state.conversation!.messages = [];
                }
                if(typeof state.conversation!.messages === 'string' ) return;
                state.conversation!.messages.push(payload);
            } catch (error) {
                
                console.error(error);

            }
        },

        async handleNewMessage({state}, payload){
            const myuuid = sessionStorage.getItem("uuid");
            if( payload.author === myuuid ) return;
            if( ! state.conversation ) return;
            const currentConversationUuid = state.conversation.uuid;
            if( currentConversationUuid !==  payload.conversation ) return;
            if( ! state.conversation.messages ){
                state.conversation.messages = [];
            }
            if( typeof state.conversation.messages === 'string' ) return;
            state.conversation.messages.push({
                mymessage:payload.author === sessionStorage.getItem('uuid'),
                body:payload.body,
                author:payload.uuid,
                conversation:payload.conversation,
            } as IMessage)

        }

    }
});

export { store };