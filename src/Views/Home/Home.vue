<script setup>
import Button from "../../components/Button/Button.vue";
import MainImg from "../../assets/mainimg.png";
</script>

<template>
  <!-- Hero Section -->
  <section class="container w-[calc(100% - 2rem)] m-auto">
    <div class="flex flex-row items-center justify-center xl:justify-between">
      <span class="flex flex-col gap-4">
        <h1 class="text-5xl font-semibold text-white">
          Dawood is A <span class="text-mainPink">Full Stack Developer</span>
        </h1>
        <p class="text-gray-400 text-lg tracking-widest">
          He engineers sleek, responsive websites with a creative touch
        </p>
        <Button>Contact me</Button>
      </span>
      <span
        class="relative xl:inline-block hidden before:content-[url('./assets/Dots.png')] before:absolute before:top-[7rem] before:left-[18rem] before:rotate-12"
      >
        <img class="max-w-2xl w-full h-auto" :src="MainImg" alt="body img" />
      </span>
    </div>
  </section>
</template>
