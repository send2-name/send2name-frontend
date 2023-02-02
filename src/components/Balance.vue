<template>
  <div class="d-flex justify-content-center" v-if="isActivated">
    <div class="card text-white bg-secondary balances-card">
      <div class="card-body text-center">
        <button class="btn btn-secondary text-uppercase mb-3">
          Your tokens
          <span v-if="userStore.getTokenLoadingStatus" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        </button>

        <table class="table table-hover table-secondary table-borderless">
          <tbody>
            <tr v-for="(tokenBalance, tokenTicker) in getCurrentChainTokens" :key="tokenTicker">
              <td>{{ tokenTicker }}</td>
              <td>{{ Math.round( tokenBalance * 10000 + Number.EPSILON ) / 10000 }}</td>
              <!--<td>Swap</td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/user';
import { useEthers } from 'vue-dapp';

export default {
  name: "Balance",

  computed: {
    getCurrentChainTokens() {
      const tokenBalances = this.userStore.getTokenBalances;

      if (tokenBalances && this.chainId) {
        const bArray = Object.entries(tokenBalances[String(this.chainId)]);
        const filtered = bArray.filter(([key, value]) => (!String(value).startsWith("0x") && Number(value) > 0));
        return Object.fromEntries(filtered);
      }

      return null;
    }
  },

  setup() {
    const { chainId, isActivated } = useEthers();
    const userStore = useUserStore();

    return {
      chainId,
      isActivated,
      userStore
    }
  },
}
</script>

<style scoped>
.table {
  --bs-table-accent-bg: none;
}
</style>