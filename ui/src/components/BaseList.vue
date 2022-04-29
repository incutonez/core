<template>
  <ul class="base-list">
    <li
      v-for="option in records"
      :key="option.fullPath"
      :class="records.getOptionCls(option, selections)"
      @click="onClickListItem($event, option, isGrouped)"
    >
      <template v-if="option.records">
        <div class="group">
          <slot
            name="groupDisplay"
            :group="option"
          >
            Group: {{ records.getOptionDisplay(option) }}
          </slot>
        </div>
        <BaseList
          :options="option.records"
          :selections="selections"
          @update:selections="onUpdateSelections"
          @click:item="onClickItem"
        >
          <template
            v-for="(_, slot) of $slots"
            #[slot]="scope"
          >
            <slot
              :name="slot"
              v-bind="scope"
            />
          </template>
        </BaseList>
      </template>
      <template v-else>
        <slot
          name="listItemDisplay"
          :option="option"
        >
          {{ records.getOptionDisplay(option) }}
        </slot>
      </template>
    </li>
  </ul>
</template>

<script>
import {
  computed,
  reactive,
  watchEffect,
} from "vue";
import { Collection } from "ui/classes/Collection.js";

const SelectedCls = "list-item-selected";
export default {
  name: "BaseList",
  emits: ["update:selections", "click:item"],
  props: {
    /**
     * @type {Collection}
     */
    options: {
      type: [Array, Object],
      default: () => [],
    },
    selections: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    // TODOJEF: https://sfc.vuejs.org/#eyJBcHAudnVlIjoiPHNjcmlwdD5cbiAgaW1wb3J0IHt3YXRjaEVmZmVjdCwgcmVhY3RpdmUsIGNvbXB1dGVkfSBmcm9tIFwidnVlXCI7XG4gIGltcG9ydCB7Q29sbGVjdGlvbn0gZnJvbSBcIi4vQ29sbGVjdGlvbi5qc1wiO1xuICBleHBvcnQgZGVmYXVsdCB7XG4gICAgbmFtZTogXCJBcHBcIixcbiAgICBwcm9wczoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgZGVmYXVsdDogWzEsIDIsIDNdXG4gICAgICB9XG4gICAgfSxcbiAgICBzZXR1cChwcm9wcykge1xuICAgICAgY29uc3QgY29sbGVjdGlvbjEgPSByZWFjdGl2ZShuZXcgQ29sbGVjdGlvbigpKTtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb24yID0gY29tcHV0ZWQoKCkgPT4gcmVhY3RpdmUobmV3IENvbGxlY3Rpb24ocHJvcHMub3B0aW9ucykpKVxuICAgICAgd2F0Y2hFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnY29sbGVjdGlvbiAyJywgY29sbGVjdGlvbjIsIGNvbGxlY3Rpb24yLmxlbmd0aClcbiAgICAgIH0pXG4gICAgICB3YXRjaEVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb2xsZWN0aW9uIDEnLCBjb2xsZWN0aW9uMSwgY29sbGVjdGlvbjEubGVuZ3RoKVxuICAgICAgfSlcbiAgICAgIHdhdGNoRWZmZWN0KCgpID0+IGNvbGxlY3Rpb24xLmFkZChwcm9wcy5vcHRpb25zKSlcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvbGxlY3Rpb24xLFxuICAgICAgICBjb2xsZWN0aW9uMixcbiAgICAgICAgb25DbGlja1VwZGF0ZTEoKSB7XG4gICAgICAgICAgY29sbGVjdGlvbjEucHVzaCgyMjIyKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25DbGlja1VwZGF0ZTIoKSB7XG4gICAgICAgICAgY29sbGVjdGlvbjIudmFsdWUucHVzaCgyMjIyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICBDb2xsZWN0aW9uIDFcbiAgICA8YnV0dG9uIEBjbGljaz0nb25DbGlja1VwZGF0ZTEnPlxuICAgICAgVXBkYXRlXG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuICA8ZGl2IHYtZm9yPVwiaXRlbSBpbiBjb2xsZWN0aW9uMVwiIDprZXk9XCJpdGVtXCI+XG4gICAge3tpdGVtfX1cbiAgPC9kaXY+XG4gIDxkaXY+XG4gICAgQ29sbGVjdGlvbiAyXG4gICAgPGJ1dHRvbiBAY2xpY2s9J29uQ2xpY2tVcGRhdGUyJz5cbiAgICAgIFVwZGF0ZVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiB2LWZvcj1cIml0ZW0gaW4gY29sbGVjdGlvbjJcIiA6a2V5PVwiaXRlbVwiPlxuICAgIHt7aXRlbX19XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT4iLCJpbXBvcnQtbWFwLmpzb24iOiJ7XG4gIFwiaW1wb3J0c1wiOiB7XG4gICAgXCJ2dWVcIjogXCJodHRwczovL3NmYy52dWVqcy5vcmcvdnVlLnJ1bnRpbWUuZXNtLWJyb3dzZXIuanNcIlxuICB9XG59IiwiQ29sbGVjdGlvbi5qcyI6ImV4cG9ydCBjbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgQXJyYXkge1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoKTtcbiAgICBkYXRhPy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnB1c2goaXRlbSkpO1xuICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xuICAgICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgXG4gIGFkZChpdGVtcykge1xuICAgIGl0ZW1zID0gQXJyYXkuaXNBcnJheShpdGVtcykgPyBpdGVtcyA6IFtpdGVtc107XG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5wdXNoKGl0ZW0pKVxuICB9XG59In0=
    // Figure out why this doesn't work
    const records = computed(() => reactive(new Collection(props.options)));
    // watchEffect(() => {
    //   records.displayField = props.options.displayField;
    //   records.records = props.options.records;
    //   records.records = options;
    // });
    /**
     * We always want to be dealing with our class, so we can normalize the functionality
     */
    // const records = computed(() => {
    // });
    watchEffect(() => {
      console.log(records, records.value.length);
    });
    const idField = computed(() => records.value.idField);
    const displayField = computed(() => records.value.displayField);
    const isGrouped = computed(() => records.value.grouped);
    function emitUpdate(args) {
      emit("update:selections", ...args);
    }
    function emitClick(args) {
      emit("click:item", ...args);
    }
    function onUpdateSelections(...args) {
      emitUpdate(args);
    }
    function onClickItem(...args) {
      emitClick(args);
    }
    function onClickListItem(event, option) {
      if (option.isGroup) {
        return;
      }
      emitUpdate([option, event.target.classList.contains(SelectedCls)]);
      emitClick([option]);
    }
    return {
      records,
      isGrouped,
      idField,
      displayField,
      onClickListItem,
      onUpdateSelections,
      onClickItem,
    };
  },
};
</script>

<style lang="scss">
.list-item {
  @apply py-1 px-2 hover:bg-slate-300 cursor-pointer;
  &.list-item-selected,
  &:hover {
    box-shadow: inset 2px 0 #3B82F6;
  }

  &.list-item-selected {
    @apply text-blue-700 bg-blue-100;
  }
}

.group {
  @apply px-2 text-gray-400 text-sm h-8 leading-8;
}

.group-wrapper:not(:first-child) {
  @apply border-t;
}
</style>
