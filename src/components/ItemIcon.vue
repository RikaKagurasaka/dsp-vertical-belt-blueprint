<script setup lang="ts">
import {computed} from "vue";
import {computedAsync} from "@vueuse/core";
import {items} from "../data/itemsData.ts";
import {iconUrl} from "../data/icons.ts";

const prop = defineProps<{ iconId: number }>()
const imgSrc = computedAsync(() => iconUrl(prop.iconId), '')
</script>

<template>
    <img :src="imgSrc">
</template>

<style scoped>

</style>