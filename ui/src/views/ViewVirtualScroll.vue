<template>
  <BaseDialog
    title="Virtual Scroll"
    class="header-blue"
  >
    <template #body>
      <div class="flex flex-1 flex-col overflow-hidden p-2">
        <div class="mb-4 flex space-x-2">
          <BaseField
            label="Total"
            :model-value="dataTotal"
            :input-attrs-cfg="inputAttrs"
            input-width="w-20"
            label-width="w-auto"
          />
          <BaseField
            label="Loaded"
            :model-value="totalLoaded"
            input-width="w-20"
            label-width="w-auto"
            :input-attrs-cfg="inputAttrs"
          />
          <BaseField
            v-model="goto"
            label="Goto"
            input-width="w-20"
            label-width="w-auto"
            @keydown.enter="onEnterGoto"
          />
          <BaseButton
            text="Refresh"
            class="default"
            @click="onClickRefreshButton"
          />
        </div>
        <section
          v-bind="containerProps"
          class="flex-1"
        >
          <div
            v-bind="wrapperProps"
            class="space-y-2"
          >
            <div
              v-for="item in list"
              :key="item.index"
              class="h-16 border"
            >
              <span v-if="item.data">{{ item.data.index }}: {{ item.data.name }}</span>
            </div>
          </div>
        </section>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, unref } from "vue";
import { useScroll, useVirtualList } from "@vueuse/core";
import { BaseDialog, BaseButton, BaseField } from "ui/index";
import { faker } from "@faker-js/faker";

const data = reactive<any[]>([]);
const dataTotal = ref(0);
const pageSize = ref(50);
const loadedPages = reactive<number[]>([]);
const ItemHeight = 72;
const RecordThreshold = 20;
const totalLoaded = ref(0);
const goto = ref(0);
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  data, {
    itemHeight: ItemHeight,
  },
);

const { y } = useScroll(
  containerProps.ref, {
    throttle: 100,
    idle: 100,
    onScroll() {
      const index = Math.ceil(y.value / ItemHeight);
      // Check the next x records have loaded
      loadRecords(index + RecordThreshold);
      // Check the previous x records have loaded
      loadRecords(index - RecordThreshold);
    },
    async onStop(event) {
      // We want to await the next refresh, so we can get the latest scrollTop value
      await nextTick();
      const index = Math.ceil((event.target as HTMLElement).scrollTop / ItemHeight);
      // Check the next x records have loaded
      loadRecords(index + RecordThreshold);
      // Check the previous x records have loaded
      loadRecords(index - RecordThreshold);
    },
  },
);

function getNewTotal() {
  dataTotal.value = Math.floor(Math.random() * 5000);
}

async function loadRecords(take = 0) {
  const $pageSize = unref(pageSize);
  const page = Math.floor(take / $pageSize);
  if (page < 0 || loadedPages.includes(page)) {
    return;
  }
  // Normalize the amount we want to take
  take = page * $pageSize;
  loadedPages.push(page);
  // Reset our data if we don't match
  if (data.length !== dataTotal.value) {
    data.splice(0);
    for (let i = 0; i < dataTotal.value; i++) {
      data.push(null);
    }
  }
  return new Promise((resolve) => {
    // Simulate async request
    setTimeout(() => {
      let count = $pageSize * (page + 1);
      const $dataTotal = unref(dataTotal);
      if ($dataTotal < $pageSize || $dataTotal - take < $pageSize) {
        count = $dataTotal;
      }
      for (let i = take; i < count; i++) {
        data.splice(i, 1, {
          index: i,
          name: faker.name.fullName(),
        });
        totalLoaded.value++;
      }
      resolve(true);
    }, 1000);
  });
}

function reloadRecords() {
  scrollTo(0);
  goto.value = 0;
  data.splice(0);
  getNewTotal();
  totalLoaded.value = 0;
  loadedPages.splice(0);
  loadRecords();
}

function onClickRefreshButton() {
  reloadRecords();
}

function inputAttrs() {
  return {
    readonly: true,
  };
}

function onEnterGoto() {
  scrollTo(goto.value);
}

getNewTotal();
loadRecords();
</script>
