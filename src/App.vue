<template>
	<Navbar />

	<router-view></router-view>
	<vd-board
		v-if="connectorsCreated"
		:connectors="connectors"
		dark
		:autoConnectErrorHandler="autoConnectErrorHandler"
		:connectErrorHandler="connectErrorHandler"
	/>
</template>

<script>
import Navbar from './components/Navbar.vue';
import { MetaMaskConnector, WalletConnectConnector, CoinbaseWalletConnector, SafeConnector } from 'vue-dapp';
import { ref, onBeforeMount } from 'vue';

export default {
  name: "App",

	components: {
		Navbar
	},

  setup() {
    const isDev = import.meta.env.DEV;
		const infuraId = isDev ? import.meta.env.VITE_INFURA_KEY : 'ff6a249a74e048f1b413cba715f98d07';

		let connectors = [
			new MetaMaskConnector({
				appUrl: 'http://localhost:3000',
			}),
			new WalletConnectConnector({
				qrcode: true,
				rpc: {
					1: `https://mainnet.infura.io/v3/${infuraId}`,
					4: `https://rinkeby.infura.io/v3/${infuraId}`,
				},
			}),
			new CoinbaseWalletConnector({
				appName: 'Vue Dapp',
				jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
			}),
		]

		const connectorsCreated = ref(false)

		onBeforeMount(async () => {
			const safe = new SafeConnector()

			try {
				if (await safe.isSafeApp()) {
					connectors = [safe]
				}
			} catch (err) {
				console.error(err)
			}

			connectorsCreated.value = true
		})

		const autoConnectErrorHandler = (err) => {
			console.error(err)
		}

		const connectErrorHandler = (err) => {
			console.error(err)
		}

		return {
			autoConnectErrorHandler,
			connectErrorHandler,
			connectors,
			connectorsCreated
		}
  },
}
</script>
