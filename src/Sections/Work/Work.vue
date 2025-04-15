<script setup lang="ts">
import { RouterLink } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons/faArrowCircleRight";
import ProjectCard from "../../components/ProjectCard/ProjectCard.vue";
import ImageOne from "../../assets/proj1.png";

interface Project {
  thumbnail: string;
  title: string;
  subtitle: string;
  link: string;
  tech: string;
}

const Projects: Project[] = [
  {
    thumbnail: ImageOne,
    title: "Crud Web App",
    subtitle: "Only for Web",
    link: "https://crud-app-nine-nu.vercel.app/login",
    tech: "Next Js, Redux Store, Tailwindcss",
  },
];
</script>

<template>
  <section class="container w-[calc(100% - 2rem)] m-auto py-10">
    <div class="flex flex-col gap-8">
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

      <span class="w-full flex flex-wrap gap-6 items-center justify-between">
        <ProjectCard
          v-for="(project, index) in Projects"
          :key="index"
          :thumbnail="project.thumbnail"
          :title="project.title"
          :subtitle="project.subtitle"
          :link="project.link"
          :tech="project.tech"
        />
      </span>
    </div>
  </section>
</template>
