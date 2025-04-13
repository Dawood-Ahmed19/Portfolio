<script setup>
import { RouterLink } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons/faArrowCircleRight";
</script>

<template>
  <section class="container w-[calc(100% - 2rem)] m-auto">
    <div class="flex flex-col">
      <span class="flex flex-row justify-between w-full">
        <h1
          class="text-white text-3xl inline-block align-middle tracking-widest relative after:content-[''] after:absolute after:top-1/2 after:ml-4 after:w-full after:h-px after:bg-mainPink"
        >
          <span class="text-mainPink">#</span>projects
        </h1>
        <RouterLink
          class="align-middle inline-block text-gray-400 hover:text-white"
          to="/work"
          >View All <FontAwesomeIcon class="ml-2" :icon="faArrowCircleRight"
        /></RouterLink>
      </span>

      <span> </span>
    </div>
  </section>
</template>
