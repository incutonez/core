<template>
  <FieldNumber v-bind="$props" :step="1" :parse-value="parseInteger" />
</template>

<script setup lang="ts">
import { FieldNumber } from "ui/index";
import { parseInteger } from "ui/utilities";
</script>
