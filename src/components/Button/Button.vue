<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <RouterLink
    to="/contact"
    class="border border-mainPink px-6 py-3 hover:bg-mainPink text-gray-300 font-semibold w-fit"
  >
    <slot />
  </RouterLink>
</template>
