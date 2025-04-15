<script setup lang="ts">
defineProps<{
  thumbnail: string;
  title: string;
  subtitle: string;
  link: string;
  tech: string;
}>();
</script>

<template>
  <div class="bg-darkGray text-white overflow-hidden shadow-md w-full max-w-xs">
    <span>
      <img :src="thumbnail" :alt="title" class="w-full h-36 object-cover" />
    </span>

    <span
      class="border-t border-gray-600 px-4 py-2 text-sm text-gray-300 flex flex-wrap gap-2"
    >
      <p class="text-sm text-gray-400">{{ tech }}</p>
    </span>

    <span class="px-4 py-2 block">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <p class="text-sm text-gray-400">{{ subtitle }}</p>
    </span>

    <span
      class="flex justify-between items-center px-4 py-3 border-t border-gray-600 text-sm"
    >
      <a
        class="border border-mainPink px-6 py-3 hover:bg-mainPink"
        :href="link"
        target="_blank"
        >Live</a
      >
    </span>
  </div>
</template>
