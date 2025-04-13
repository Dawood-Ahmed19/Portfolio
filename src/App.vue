<script setup lang="ts">
import Navbar from "./components/Navbar/Navbar.vue";
// Icons
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const icons = [
  {
    icon: faLinkedin,
    path: "https://www.linkedin.com/in/dawood-ahmed-911742275/",
  },
  {
    icon: faGithub,
    path: "https://github.com/Dawood-Ahmed19",
  },
];
</script>

<template>
  <!-- Social Links -->

  <span class="absolute ml-4 mt-20 lg:block hidden">
    <ul type="none">
      <li v-for="icon in icons" :key="icon.path">
        <a target="_blank" :href="icon.path" class="text-gray-400">
          <FontAwesomeIcon :icon="icon.icon" />
        </a>
      </li>
    </ul>
  </span>

  <!-- Main content -->
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-1 flex flex-col">
      <RouterView />
    </main>
  </div>
</template>
