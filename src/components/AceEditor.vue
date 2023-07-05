<script setup lang="ts">
import {edit, config} from "ace-builds";
import {onMounted, watch} from "vue";

const props = defineProps<{
    id: string,
    value: string,
    mode: ''
}>()
let editor: ReturnType<typeof edit>
const emit = defineEmits(['update:value'])
//@ts-ignore
config.setModuleLoader('ace/mode/json', () => import('ace-builds/src-noconflict/mode-json.js'));
//@ts-ignore
config.setModuleLoader('ace/mode/javascript', () => import('ace-builds/src-noconflict/mode-javascript.js'));
//@ts-ignore
config.setModuleLoader('ace/theme/one_dark', () => import('ace-builds/src-noconflict/theme-one_dark.js'));

onMounted(() => {
    editor = edit(props.id, {
        theme: 'ace/theme/one_dark',
        mode: `ace/mode/${props.mode}`,
        useWorker: false,
    })

    editor.session.on("change", () => {
        emit('update:value', editor.getValue())
    })
    editor.setValue(props.value)
})
watch(() => props.value, () => {
    //Get the Current Positon
    const currentPosition = editor.selection.getCursor();

//Insert data into the editor
    editor.setValue(props.value);
    editor.clearSelection();

//Set the cursor to the Initial Point
    editor.gotoLine(currentPosition.row+1, currentPosition.column, false);
})

</script>

<template>
    <div :id="props.id"/>
</template>

<style scoped>

</style>