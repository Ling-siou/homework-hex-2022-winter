import { ref, computed } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js";

export default function () {
  const count = ref(0);
  const double = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }
  return {
    count,
    double,
    increment
  };
}

/*
// 測試 composition api
import useCounter from './useCounter.js';

    setup() {
        const { count, double, increment} = useCounter();
        return {
          count,
          double,
          increment
        };
    },

*/