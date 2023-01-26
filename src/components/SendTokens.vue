<template>
<div class="d-flex justify-content-center mt-4">
<div class="card text-white bg-primary mb-3" style="max-width: 40rem;">
  <div class="card-body text-center">

    <!-- Select network -->
    <button 
      class="btn btn-primary dropdown-toggle" 
      type="button" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
    >
      {{ getChainName(chainId) }}
    </button>
    
    <div class="dropdown-menu p-2 dropdown-menu-end">
      <div class="mb-3">
        <input 
          class="form-control mb-2" 
          placeholder="Find network"
          v-model="filterNetwork" 
        />

        <li>
          <button 
            class="dropdown-item" 
            type="button"
            v-for="networkName in getNetworks"
            :key="networkName"
            @click="changeNetwork(networkName)"
          >SWITCH TO {{ networkName }}</button>
        </li>
      </div>
    </div>
    <!-- END Select network -->

    <!-- Recipient -->
    <div class="mt-2">
      <input 
        v-model="receiver"
        class="form-control text-center"
        placeholder="Enter the receiver's domain name"
      >
    </div>
    <!-- END Recipient -->

  </div>
</div>
</div>
</template>

<script>
import useChainHelpers from "../composables/useChainHelpers";
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';

export default {
  name: "SendTokens",

  data() {
    return {
      filterNetwork: null,
      receiver: null
    }
  },

  computed: {
    getNetworks() {
      const networkNames = this.getSupportedChains();

      if (this.filterNetwork) {
        return networkNames.filter(item => item.includes(this.filterNetwork.toUpperCase())); //filtered
      }

      return networkNames;
    },
  },

  methods: {
    changeNetwork(networkName) {
      document.activeElement.blur(); // close the Daisy UI dropdown

      const networkData = this.switchNetwork(networkName); 

      window.ethereum.request({ 
        method: networkData.method, 
        params: networkData.params
      });

      
    },
  },

  setup() {
    const { address, chainId, isActivated } = useEthers();
    const { getChainName, getSupportedChains, switchNetwork } = useChainHelpers();

    return { chainId, getChainName, getSupportedChains, switchNetwork }
  },
}
</script>