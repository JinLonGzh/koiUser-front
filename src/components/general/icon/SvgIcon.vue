<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
const props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: () => '',
  },
})

const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})
const svgClass = computed(() => {
  return props.className ? 'svg-icon ' + props.className : 'svg-icon';
})

</script>
<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>