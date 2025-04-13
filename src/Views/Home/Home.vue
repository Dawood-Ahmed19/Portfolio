<script setup>
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
  <span class="absolute">
    <li v-for="icon in icons" :key="icon.icon">
      <a target="_blank" :href="icon.path">
        <FontAwesomeIcon :icon="icon.icon" />
      </a>
    </li>
  </span>
</template>
