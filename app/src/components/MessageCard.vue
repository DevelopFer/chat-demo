<template>
    <div :class="myMessage ? 'd-flex justify-end':'d-flex'">
        <v-card 
            :color="myMessage?'primary':'default'"
            variant="tonal"
            max-width="90%"
            elevation="2" 
            min-height="20%"
            style="border-top-right-radius: 0;border-bottom-left-radius: 0;max-height: auto;"
            >
            <v-card-text background-color="primary" class="d-flex flex-column">
                <span v-text="props.body"></span>
                <!-- <small class="d-flex justify-end">
                    <strong>10/01/2023 20:30</strong>
                </small> -->
            </v-card-text>
        </v-card>
        
    </div>
</template>
<script lang="ts" setup>
    const props = defineProps<{
        body?:String,
        myMessage?:boolean
    }>()
</script>