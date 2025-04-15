<script setup lang="ts">
import { RouterLink } from "vue-router";
import { defineProps } from "vue";

const props = defineProps<{
  to: string;
}>();
</script>

<template>
  <RouterLink
    :to="props.to"
    class="border border-mainPink px-6 py-3 hover:bg-mainPink text-gray-300 font-semibold w-fit"
  >
    <slot />
  </RouterLink>
</template>
