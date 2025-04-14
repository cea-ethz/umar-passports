<template>
  <ul class="json-tree">
    <li v-for="(value, key) in data" :key="key">
      <div class="json-item">
        <span
          v-if="isObject(value)"
          @click="toggle(key)"
          class="toggle"
          style="cursor: pointer"
        >
          {{ key }}: <span>{{ collapsed[key] ? "[+]" : "[-]" }}</span>
        </span>
        <span v-else> {{ key }}: {{ value }} </span>
      </div>
      <div
        v-if="isObject(value) && !collapsed[key]"
        class="children"
        style="padding-left: 16px"
      >
        <JsonTree :data="value" />
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "JsonTree",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      collapsed: {},
    };
  },
  methods: {
    isObject(val) {
      return val !== null && typeof val === "object";
    },
    toggle(key) {
      this.collapsed[key] = !this.collapsed[key];
    },
  },
};
</script>

<style scoped>
.json-tree {
  list-style-type: none;
  padding-left: 0;
}
.json-item {
  margin: 2px 0;
}
</style>
