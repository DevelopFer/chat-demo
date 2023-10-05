<template>
    <v-container>
        <v-card class="d-flex" min-height="100vh" flat>
            <v-row justify="center" align="center">
                <v-col lg="4" sm="6" md="5" xs="12" class="mx-3">
                    <v-alert @click:close="updateErrorMsg('')" v-if="hasErrorMessage" closable :text="error" type="warning"></v-alert>
                    <v-card min-height="15vh" elevation="6" width="100%">
                        <v-card-text>
                            <div class="d-flex justify-center align-center mb-5 flex-column">
                                <v-avatar size="50" color="primary">
                                    <v-icon size="x-large">mdi-login</v-icon>
                                </v-avatar>
                                <span class="text-h6">Welcome to Chat</span>
                            </div>
                            <v-text-field @keyup.enter.native="access"  :rules="[required]" focused v-model="username" variant="outlined" label="Name" placeholder="Enter your name"></v-text-field>
                            <v-btn @click="access" block size="large" color="primary" class="mt-2">
                                Enter
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script setup lang="ts">
    
    import { router } from '@/router';
    import { computed, ref } from 'vue';
    import { API } from "./../api/API";

    const notHasData      = computed( () => ! username.value.length );
    const hasErrorMessage = computed( () => error.value.length );
    
    const username = ref("");
    const error    = ref("");
    const loading  = ref(false);
    
    const required = (v:string) => {
        return !!v || 'Field is required'
    };

    const access = async () => {
        loading.value = true;
        try {
            if(  ! username.value ){
                updateErrorMsg('Please enter your name');
                return;
            }
            const response = await API.post('/api/username', {username:username.value});
            if( ! response.data.success ) throw new Error("Error from api");
            if( ! response.data.isValid ){
                await setUserData(response.data.user);
            }else{
                await storeUserAndSet();
            }
            updateErrorMsg("");
            goToChat();
        } catch (error:any) {
            console.error(error);
            updateErrorMsg(error.message);
        }finally{
            loading.value = false;
        }
    };

    const storeUserAndSet = async () => {
        const response = await API.post("/api/users",{
            name:username.value
        });
        if( ! response.data.success ) throw new Error('Error saving user');
        const data = {
            username: response.data.user.name,
            uuid    : response.data.user.uuid
        }
        setUserData(data);
    };

    const setUserData = (userDoc:IUser) => {
        sessionStorage.setItem("username",userDoc.username);
        sessionStorage.setItem("uuid",userDoc.uuid);
    }

    const updateErrorMsg = (msg:string) => {
        error.value = msg;
    };

    const storeUsername = (userDoc:IUser) => {
        sessionStorage.setItem("username",userDoc.username);
        sessionStorage.setItem("uuid",userDoc.uuid);
    }
    
    const goToChat = () => {
        router.push({path:'/chat'})
    }
    

</script>