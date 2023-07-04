<script setup lang="ts">
import {computedAsync} from "@vueuse/core";
import {iconUrl} from "../data/icons.ts";

const prop = defineProps<{ iconId: number }>()
const imgSrc = computedAsync(() => iconUrl(prop.iconId), '')
</script>

<template>
    <img :src="imgSrc">
</template>

<style scoped>

</style>