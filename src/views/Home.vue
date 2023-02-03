<template>
  <SendTokens />

  <Balance />

  <PaymentLink />
</template>

<script>
import Balance from '../components/Balance.vue';
import PaymentLink from '../components/PaymentLink.vue';
import SendTokens from '../components/SendTokens.vue';

export default {
  name: "Home",

  components: {
    Balance,
    PaymentLink,
    SendTokens
  },
  
  setup() {
    
  },
}
</script>