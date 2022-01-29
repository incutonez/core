<template>
  <Button :text="theText" />
</template>

<script>
import Button from "core-ui/src/Button.vue";

export default {
  name: "ButtonIcon",
  components: { Button },
  props: {
    theText: {
      type: String,
      default: "",
    }
  }
};
</script>
