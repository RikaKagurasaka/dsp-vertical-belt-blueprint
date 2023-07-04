<script setup lang="ts">
import VerticalBelt from "./views/VerticalBelt.vue";
</script>

<template>
    <nav class="flex justify-center gap-6">
        <router-link to="/">戴森球竖直传送带蓝图工具</router-link>
        <router-link to="/parse">戴森球蓝图分析工具</router-link>
       <div>
           <span class="px-1">Author: Rika</span>
           <span> | </span>
           <a href="https://github.com/RikaKagurasaka/dsp-vertical-belt-blueprint">Github</a>
       </div>
    </nav>
    <router-view/>
</template>

<style scoped>
router-link{

}
</style>