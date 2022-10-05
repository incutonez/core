<template>
  <BaseDialog
    title="Infinite Scroll"
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
            :model-value="data.length"
            input-width="w-20"
            label-width="w-auto"
            :input-attrs-cfg="inputAttrs"
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
              {{ item.data.name }}
            </div>
          </div>
        </section>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, unref, watch } from "vue";
import { useInfiniteScroll, useVirtualList } from "@vueuse/core";
import { BaseDialog, BaseButton } from "ui/index";
import { faker } from "@faker-js/faker";
import BaseField from "ui/components/BaseField.vue";

interface IData {
  name: string;
}

const loading = ref(false);
const data = reactive<IData[]>([]);
const dataTotal = ref(0);
const pageSize = ref(50);
const skip = ref(0);
const allLoaded = computed(() => data.length === dataTotal.value);
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  data, {
    itemHeight: 72,
  },
);

useInfiniteScroll(containerProps.ref, () => {
  skip.value += pageSize.value;
}, {
  distance: 1000,
});

function getNewTotal() {
  dataTotal.value = Math.floor(Math.random() * 300);
}

async function loadData(take = skip.value) {
  if (loading.value || allLoaded.value) {
    return;
  }
  loading.value = true;
  return new Promise((resolve) => {
    // Simulate async request
    setTimeout(() => {
      let count = pageSize.value;
      const $dataTotal = unref(dataTotal);
      if ($dataTotal < pageSize.value) {
        count = $dataTotal;
      }
      else if ($dataTotal - take < pageSize.value) {
        count = $dataTotal - take;
      }
      for (let i = 0; i < count; i++) {
        data.push({
          name: faker.name.fullName(),
        });
      }
      loading.value = false;
      resolve(true);
    }, 1000);
  });
}

function onClickRefreshButton() {
  data.length = 0;
  skip.value = 0;
  getNewTotal();
  scrollTo(0);
  loadData();
}

function inputAttrs() {
  return {
    readonly: true,
  };
}

watch(skip, () => loadData());

getNewTotal();
loadData();
</script>
