<template>
  <SendTokens />

  <Balance />
</template>

<script>
import SendTokens from '../components/SendTokens.vue';
import Balance from '../components/Balance.vue';

export default {
  name: "Home",

  components: {
    Balance,
    SendTokens
  },
  
  setup() {
    
  },
}
</script>