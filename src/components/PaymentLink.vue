<template>
<div class="d-flex justify-content-center" v-if="userStore.getDefaultDomain">
  <div class="card text-white bg-primary mb-3 send-tokens-card">
    <div class="card-body text-center">
      <button class="btn btn-primary text-uppercase mb-3" @click="copyToClipboard(getPaymentLink)">
          Your payment link
      </button>

      <div class="input-group mb-3">
        <input 
          type="text" class="form-control text-center set-cursor-pointer" aria-describedby="button-payment-link"
          :value="getPaymentLink" 
          @click="copyToClipboard(getPaymentLink)"
          readonly
        />

        <button 
          class="btn btn-dark" type="button" id="button-payment-link"
          @click="copyToClipboard(getPaymentLink)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { useEthers } from 'vue-dapp';
import { useToast, TYPE } from "vue-toastification";
import { useUserStore } from '../store/user';

export default {
  name: "PaymentLink",

  computed: {
    getPaymentLink() {
      return "https://send2.name/?to=" + this.userStore.getDefaultDomain;
    }
  },

  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      this.toast("Payment link copied to your clipboard!", {type: TYPE.SUCCESS});
    }
  },

  setup() {
    const { isActivated } = useEthers();
    const userStore = useUserStore();
    const toast = useToast();

    return {
      isActivated,
      toast,
      userStore
    }
  },
}
</script>