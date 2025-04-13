<script setup lang="ts">
import { RouterLink } from "vue-router";
import Logo from "../../assets/logoWhite.png";

interface NavItems {
  label: string;
  path: string;
}

const links: NavItems[] = [
  {
    label: "home",
    path: "/",
  },
  {
    label: "works",
    path: "/works",
  },
  {
    label: "about-me",
    path: "/about",
  },

  {
    label: "contact",
    path: "/contact",
  },
];
</script>

<template>
  <div
    class="container w-[calc(100% - 2rem)] m-auto flex flex-row items-center justify-between h-16"
  >
    <span class="font-bold text-white tracking-wider">
      <img class="h-8 inline-block align-middle" :src="Logo" alt="logo-img" />
      <span class="inline-block align-middle ml-2">Dawood Ahmed</span>
    </span>
    <ul type="none" class="hidden flex-row gap-4 md:flex">
      <li v-for="link in links" :key="link.path">
        <RouterLink
          :to="link.path"
          :class="[
            'tracking-wider',
            $route.path === link.path ? 'text-white' : 'text-gray-400',
          ]"
        >
          <span
            :class="
              $route.path === link.path ? 'text-mainPink' : 'text-pink-500'
            "
          >
            #</span
          >
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
