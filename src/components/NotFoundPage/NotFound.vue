<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="h-full flex-1 flex flex-col items-center justify-center gap-5">
    <h1 class="text-5xl text-white font-bold">
      <span class="text-red-500">4</span>0<span class="text-red-500">4</span>
      Page Not Found!
    </h1>

    <RouterLink to="/" class="text-white underline"
      >Go back to Home Page</RouterLink
    >
  </div>
</template>
