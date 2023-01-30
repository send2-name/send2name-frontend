<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid">

    <router-link to="/" class="navbar-brand">
      <img class="img-fluid navbar-img" src="../assets/img/logo.svg">
    </router-link>


    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor01">

      <ul class="navbar-nav ms-auto">

        <!--
        <li class="nav-item">
          <button class="btn btn-primary">About</button>
        </li>
        -->

        <li v-if="isActivated" class="nav-item dropdown">
          <button 
						class="btn btn-primary dropdown-toggle network-dropdown" 
						data-bs-toggle="dropdown" type="button" 
						aria-haspopup="true" aria-expanded="false"
					>{{ getChainName(chainId) }}</button>

          <div class="dropdown-menu p-2 dropdown-menu-end set-cursor-pointer">
            <input 
              class="form-control mb-2" 
              placeholder="Find network"
              v-model="filterNetwork" 
            />

            <span 
              class="dropdown-item"
              v-for="networkName in getNetworks"
              :key="networkName"
              @click="changeNetwork(networkName)"
            >{{networkName}}</span>
          </div>
        </li>

        <li v-if="isActivated" class="nav-item dropdown">
          <button 
						class="btn btn-primary dropdown-toggle" 
						data-bs-toggle="dropdown" type="button" 
						aria-haspopup="true" aria-expanded="false"
					>{{ getDomainOrAddress }}</button>

          <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
            <span class="dropdown-item">{{ shortenAddress(address) }}</span>
            <span class="dropdown-item" @click="disconnect">Disconnect</span>
          </div>
        </li>

				<li class="nav-item">
					<button v-if="!isActivated" class="btn btn-primary" @click="open">Connect wallet</button>
				</li>

      </ul>

    </div>
  </div>
</nav>
</template>

<script>
import { useBoard, useEthers, useWallet, shortenAddress } from 'vue-dapp';
import useChainHelpers from "../composables/useChainHelpers";
import { useUserStore } from '../store/user';

export default {
  name: "Navbar",

  data() {
    return {
      filterNetwork: null,
    }
  },

  computed: {
    getDomainOrAddress() {
      if (this.userStore.getDefaultDomain) {
        return this.userStore.getDefaultDomain;
      } else {
        return shortenAddress(this.address);
      }
    },

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
      const networkData = this.switchNetwork(networkName); 

      window.ethereum.request({ 
        method: networkData.method, 
        params: networkData.params
      });
    },
  },

  setup() {
    const { open } = useBoard();
		const { address, chainId, isActivated } = useEthers();
		const { disconnect } = useWallet();
		const { getChainName, getSupportedChains, switchNetwork } = useChainHelpers();
    const userStore = useUserStore();

		return {
			address,
			chainId,
			disconnect,
			getChainName,
			getSupportedChains,
			isActivated,
			open,
			shortenAddress,
			switchNetwork,
      userStore
		}
  },
}
</script>

<style scoped>
.network-dropdown {
  text-transform: lowercase;
}

.network-dropdown::first-letter {
  text-transform: uppercase;
}
</style>