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

export default {
  name: "App",

	components: {
		Navbar
	},

  setup() {
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
			autoConnectErrorHandler,
			connectErrorHandler,
			connectors
		}
  },
}
</script>
