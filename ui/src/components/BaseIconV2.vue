<template>
  <span class="material-icons-outlined">{{ icon }}</span>
</template>

<script setup lang="ts">
import type { MaterialIcon } from "material-icons";

export interface IPropsBaseIcon {
  icon: MaterialIcon;
}

defineProps<IPropsBaseIcon>();
</script>
