<template>
  <div class="homeList">
    <div class="homeItem" v-for="item in props.homeListData" :key="item">
      <home-item :data="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeItem from "@/components/content/home/HomeItem.vue";

const props = defineProps(["homeListData"]);

</script>

<style scoped lang="scss">

</style>