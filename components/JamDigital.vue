<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const time = ref("");
let intervalId;

function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  time.value = `${hours}:${minutes}:${seconds}`;
}

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
<template>
  <div class="text-2xl font-inter text-center">
    {{ time }}
  </div>
</template>
