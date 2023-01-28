<template>
	<Navbar />

	<router-view></router-view>
	<vd-board
		:connectors="connectors"
		dark
		:autoConnectErrorHandler="autoConnectErrorHandler"
		:connectErrorHandler="connectErrorHandler"
	/>
</template>

<script>
import Navbar from './components/Navbar.vue';
import { MetaMaskConnector, WalletConnectConnector, CoinbaseWalletConnector } from 'vue-dapp';
import rpcs from './data/rpcs.json';
import { useUserStore } from './store/user';
import { useEthers } from 'vue-dapp';

export default {
  name: "App",

	components: {
		Navbar
	},

  setup() {
		const { address, chainId } = useEthers();
		const userStore = useUserStore();

		let connectors = [
			new MetaMaskConnector({
				appUrl: 'http://localhost:3000',
			}),
			new WalletConnectConnector({
				qrcode: true,
				rpc: rpcs,
			}),
			new CoinbaseWalletConnector({
				appName: 'Vue Dapp',
				jsonRpcUrl: rpcs["1"],
			}),
		]

		const autoConnectErrorHandler = (err) => {
			console.error(err)
		}

		const connectErrorHandler = (err) => {
			console.error(err)
		}

		return {
			address,
			autoConnectErrorHandler,
			chainId,
			connectErrorHandler,
			connectors,
			userStore
		}
  },

	watch: {
		address(newVal, oldVal) {
      if (newVal) {
        this.userStore.setDefaultDomain();
      }
    },

    chainId(newVal, oldVal) {
      if (newVal) {
        this.userStore.setDefaultDomain();
      }
    },
	}
}
</script>
