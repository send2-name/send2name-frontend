<template>
	<Navbar />

	<router-view></router-view>

	<!-- Connect Wallet modal -->
	<div class="modal modal-sm fade" id="connectModal" tabindex="-1" aria-labelledby="connectModalLabel" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Connect your wallet</h5>
					<button id="closeConnectModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
						<span aria-hidden="true"></span>
					</button>
				</div>
				<div class="modal-body row">

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/metamask.svg" class="card-img-top card-img-wallet" alt="MetaMask">
					</div>

					<div class="card col-6 set-cursor-pointer" @click="connectWalletConnect">
						<img src="./assets/img/wallets/wc.png" class="card-img-top card-img-wallet" alt="Wallet Connect">
					</div>

					<div class="card col-6 set-cursor-pointer" @click="connectCoinbase">
						<img src="./assets/img/wallets/coinbase.png" class="card-img-top card-img-wallet" alt="Coinbase">
					</div>

					<div class="card col-6 set-cursor-pointer" @click="connectMetaMask">
						<img src="./assets/img/wallets/rabby.png" class="card-img-top card-img-wallet" alt="Rabby">
					</div> 
				</div>
			</div>
		</div>
	</div>
	<!-- END Connect Wallet modal -->
</template>

<script>
import Navbar from './components/Navbar.vue';
import { MetaMaskConnector, WalletConnectConnector, CoinbaseWalletConnector } from 'vue-dapp';
import rpcs from './data/rpcs.json';
import { useUserStore } from './store/user';
import { useEthers, useWallet } from 'vue-dapp';

export default {
  name: "App",

	components: {
		Navbar
	},

	methods: {
		async connectCoinbase() {
			await this.connectWith(this.coinbaseConnector);
			document.getElementById('closeConnectModal').click();
		},

		async connectMetaMask() {
			await this.connectWith(this.mmConnector);
			// @todo: store in local storage to autoconnect next time

			document.getElementById('closeConnectModal').click();
		},

		async connectWalletConnect() {
			await this.connectWith(this.wcConnector);
			document.getElementById('closeConnectModal').click();
		}
	},

  setup() {
		const { address, chainId } = useEthers();
		const { connectWith } = useWallet();
		const userStore = useUserStore();

		const coinbaseConnector = new CoinbaseWalletConnector({
			appName: 'Vue Dapp',
			jsonRpcUrl: rpcs["1"],
		});

		const mmConnector = new MetaMaskConnector({
			appUrl: 'https://send2.name',
		});

		const wcConnector = new WalletConnectConnector({
			qrcode: true,
			rpc: rpcs,
		});

		return {
			address,
			chainId,
			coinbaseConnector,
			connectWith,
			mmConnector,
			wcConnector,
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
