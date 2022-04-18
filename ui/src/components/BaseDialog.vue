<!-- TODO: If we use BaseOverlay in here, then KeepAlive doesn't work properly, and especially doesn't work
  -- with include -->
<template>
  <BaseOverlay>
    <div class="base-dialog">
      <header class="base-dialog-header">
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
        <BaseIcon
          :icon="Icon.Close"
          @click="onClickClose"
        />
      </header>
      <slot name="body" />
      <footer class="base-dialog-footer">
        Footer
      </footer>
    </div>
  </BaseOverlay>
</template>

<script>
import {
  BaseIcon,
  BaseOverlay,
} from "ui/index.js";
import {
  computed,
} from "vue";

export default {
  name: "BaseDialog",
  emits: ["update:open", "click:close"],
  components: {
    BaseIcon,
    BaseOverlay,
  },
  props: {
    open: {
      type: Boolean,
      default: true,
    },
    minimized: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const opened = computed({
      get() {
        return props.open;
      },
      set(value) {
        emit("update:open", value);
      },
    });
    function onClickClose() {
      emit("click:close");
    }
    return {
      opened,
      onClickClose,
    };
  },
};
</script>

<style scoped>
.base-dialog {
  @apply flex flex-col h-full w-full;
}
</style>
