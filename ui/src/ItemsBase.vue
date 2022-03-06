<template>
  <ul class="basis-full px-1">
    <li
      v-for="(selection, index) in selections"
      :key="index"
      class="inline-block p-1 mt-1 mr-1 text-xs whitespace-nowrap bg-gray-200 rounded border"
    >
      {{ selection[valueField] }}
      <IconBase
        :icon="Icons.CLOSE"
        class="inline-block ml-1 hover:text-red-800 cursor-pointer"
        @click="onClickRemoveOption(selection)"
      />
    </li>
  </ul>
</template>

<script>
import { Icons } from "ui/index.js";
import IconBase from "ui/IconBase.vue";

export default {
  name: "ItemsBase",
  components: {
    IconBase,
  },
  emits: ["remove:selection"],
  props: {
    /**
     * If this is supplied, then the individual options are considered as an object, and we
     * need the key to access the appropriate value
     */
    valueField: {
      type: String,
      default: "value",
    },
    selections: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    function onClickRemoveOption(option) {
      emit("remove:selection", option);
    }
    return {
      Icons,
      onClickRemoveOption,
    };
  },
};
</script>
