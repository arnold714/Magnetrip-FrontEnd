<script setup>
import { useRoute } from "vue-router";
import { RouterView } from "vue-router";
import TheHeadingNavbar from "@/components/layout/TheHeadingNavbar.vue";
import TheFooterNavbar from "@/components/layout/TheFooterNavbar.vue";
const route = useRoute();
</script>

<template>
  <div>
    <TheHeadingNavbar v-if="!route.path.startsWith('/plan/making')"></TheHeadingNavbar>
    <router-view></router-view>
    <TheFooterNavbar v-if="!route.path.startsWith('/plan/making')"></TheFooterNavbar>
  </div>
</template>

<style scoped>

</style>
