<template></template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Book",
  props: {
    bookId: {
      type: Number,
      default: () => 0,
    },
  },
});
</script>

<style>
</style>