﻿import {
  createRouter,
  createWebHashHistory,
} from "vue-router";
import Route from "ui/statics/Route";
import FieldCheckboxView from "ui/views/FieldCheckboxView.vue";
import FieldColorView from "ui/views/FieldColorView.vue";
import FieldComboBoxView from "ui/views/FieldComboBoxView.vue";
import FieldCurrencyView from "ui/views/FieldCurrencyView.vue";
import FieldIntegerView from "ui/views/FieldIntegerView.vue";
import FieldNumberView from "ui/views/FieldNumberView.vue";
import FieldPercentView from "ui/views/FieldPercentView.vue";
import FieldTextView from "ui/views/FieldTextView.vue";
import HomeView from "ui/views/HomeView.vue";
import ViewVirtualScroll from "ui/views/ViewVirtualScroll.vue";
import WizardStepsView from "ui/views/WizardStepsView.vue";

export const Router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: Route.Home,
    component: HomeView,
  }, {
    path: Route.ComboBox,
    component: FieldComboBoxView,
  }, {
    path: Route.Currency,
    component: FieldCurrencyView,
  }, {
    path: Route.Integer,
    component: FieldIntegerView,
  }, {
    path: Route.Number,
    component: FieldNumberView,
  }, {
    path: Route.Color,
    component: FieldColorView,
  }, {
    path: Route.Percent,
    component: FieldPercentView,
  }, {
    path: Route.Text,
    component: FieldTextView,
  }, {
    path: Route.CheckBox,
    component: FieldCheckboxView,
  }, {
    path: Route.WizardSteps,
    component: WizardStepsView,
  }, {
    path: Route.VirtualScroll,
    component: ViewVirtualScroll,
  }],
});
