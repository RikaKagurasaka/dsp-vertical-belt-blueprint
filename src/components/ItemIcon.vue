<script setup lang="ts">
import {iconUrl} from "../data/icons.ts";
import {computed} from "vue";

const prop = defineProps<{ iconId: number }>()
const imgSrc = computed(() => iconUrl(prop.iconId))
</script>

<template>
    <img :src="imgSrc">
</template>

<style scoped>

</style>