<template>
    <v-container>
        <v-card class="d-flex" min-height="100vh" flat>
            <v-row justify="center" align="center">
                <v-col lg="4" sm="6" md="5" xs="12" class="mx-3">
                    <v-card variant="flat" min-height="15vh"  width="100%">
                        <v-card-text class="d-flex align-center justify-center flex-column">
                            <span class="text-h3">404</span>
                            <span class="text-h6">Ooops!!</span>
                            <span class="subtitle">THAT PAGE DOES NOT EXIST</span>
                            <v-btn variant="plain" @click="goHome" block size="large" color="primary" class="mt-2">
                                Go Back Home
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


    const goHome = () => {
        router.push({path:"/chat"});
    }

</script>