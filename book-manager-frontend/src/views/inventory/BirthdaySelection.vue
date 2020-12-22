<template>
  <v-menu
    v-model="visible"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        label="生日"
        prepend-icon="mdi-calendar"
        readonly
        dense
        outlined
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      v-model="date"
      :max="new Date().toISOString().substr(0, 10)"
      min="1950-01-01"
      @change="selected"
    ></v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

const BirthdaySelectionProps = Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
  },
});

@Component
export default class BirthdaySelection extends BirthdaySelectionProps {
  private date = "";
  public async selected() {
    this.$emit("change", new Date(this.date));
  }

  get visible() {
    return this.value;
  }

  set visible(val) {
    // eslint-disable-next-line
    val && setTimeout(() => ((this.$refs.picker as any).activePicker = "YEAR"));
    this.$emit("input", val);
  }
}
</script>

<style>
</style>