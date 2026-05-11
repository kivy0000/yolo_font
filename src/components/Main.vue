<script setup lang="ts">
import ajax from "../request/ajax.ts";
const login = () => {
  ajax.get('/test')
}

</script>

<template>
main
  <p  @click="login">main登录按钮</p>
  <RouterView></RouterView>
</template>

<style scoped>
</style>