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

        <li class="nav-item">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#aboutModal">About</button>
        </li>

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
					>
            {{ getDomainOrAddress }}
            <span v-if="userStore.getDomainSearchStatus" class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
          </button>

          <div class="dropdown-menu dropdown-menu-end set-cursor-pointer">
            
            <a :href="getBlockExplorerBaseUrl(chainId)+'/address/'+address" class="short-address" target="_blank">
              <span class="dropdown-item">
                {{ shortenAddress(address) }}
              </span>
            </a>
            
            <span class="dropdown-item" @click="disconnect">Disconnect</span>
          </div>
        </li>

				<li class="nav-item">
					<button v-if="!isActivated" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#connectModal">Connect wallet</button>
				</li>

      </ul>

    </div>
  </div>
</nav>

<!-- About modal -->
<div class="modal fade" id="aboutModal" tabindex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">About Send2.name</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="modal-body">
        <p>Send2.name is a web3 app that allows you to send tokens to any supported web3 domain name.</p>

        <p>The code is completely <strong>open source</strong> and <a target="_blank" href="https://github.com/send2-name">available on GitHub</a>.</p>

        <p>The list of supported domains:</p>

        <ul>
          <li><a target="_blank" href="https://ens.domains">.eth (ENS, Ethereum)</a></li>
          <li><a target="_blank" href="https://punk.domains">.ape (Punk Domains, Polygon PoS Chain)</a></li>
          <li><a target="_blank" href="https://punk.domains">.arbi (Punk Domains, Arbitrum)</a></li>
          <li><a target="_blank" href="https://punk.domains">.arbitrum (Punk Domains, Arbitrum)</a></li>
          <li><a target="_blank" href="https://id.basebook.xyz">.basebook (Basebook, Base)</a></li>
          <li><a target="_blank" href="https://app.basin.global">.basin (Basin, Polygon PoS Chain)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.bitcoin (Unstoppable Domains, Ethereum)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.blockchain (Unstoppable Domains, Ethereum)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.crypto (Unstoppable Domains, Ethereum)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.dao (Unstoppable Domains, Ethereum)</a></li>
          <li><a target="_blank" href="https://punk.domains">.degen (Punk Domains, Polygon PoS Chain)</a></li>
          <li><a target="_blank" href="https://dns.dopewars.gg">.dope (Dope DAO, Optimism)</a></li>
          <li><a target="_blank" href="https://fantomnames.org">.fantom (Fantom Names, Fantom)</a></li>
          <li><a target="_blank" href="https://flr.domains">.flr (Flare Domains, Flare Network)</a></li>
          <li><a target="_blank" href="https://giveth.punk.domains">.giveth (Giveth DAO, Gnosis Chain)</a></li>
          <li><a target="_blank" href="https://punk.domains">.gnosis (Punk Domains, Gnosis Chain)</a></li>
          <li><a target="_blank" href="https://punk.domains">.huwa (HUWA DAO, BSC)</a></li>
          <li><a target="_blank" href="https://www.kns.earth">.klima (Klima DAO, Polygon PoS Chain)</a></li>
          <li><a target="_blank" href="https://punk.domains">.L2 (Layer2 DAO, Optimism)</a></li>
          <li><a target="_blank" href="https://punk.domains">.misie (Misie Community, Arbitrum)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.nft (Unstoppable Domains, Ethereum)</a></li>
          <li><a target="_blank" href="https://optimistic.domains">.op (Optimistic Domains, Optimism)</a></li>
          <li><a target="_blank" href="https://punk.domains">.optimism (Punk Domains, Optimism)</a></li>
          <li><a target="_blank" href="https://punk.domains">.poly (Punk Domains, Polygon PoS Chain)</a></li>
          <li><a target="_blank" href="https://names.pooly.me">.pool (PoolTogether DAO, Optimism)</a></li>
          <li><a target="_blank" href="https://ppl.domains">.ppl (People Domains, Arbitrum)</a></li>
          <li><a target="_blank" href="https://punk.domains/#/punkangel">.punkangel (Punk Domains, Arbitrum)</a></li>
          <li><a target="_blank" href="https://punk.domains">.safu (Punk Domains, BSC)</a></li>
          <li><a target="_blank" href="https://id.satraps.io">.satrap (Satrap IDs, Songbird)</a></li>
          <li><a target="_blank" href="https://sgb.domains">.sgb (Songbird Domains, Songbird)</a></li>
          <li><a target="_blank" href="https://smol.domains">.smol (Smol Brains NFT, Arbitrum)</a></li>
          <li><a target="_blank" href="https://punk.domains">.spartan (Punk Domains, Optimism)</a></li>
          <li><a target="_blank" href="https://punk.domains">.wagmi (Punk Domains, Optimism)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.wallet (Unstoppable Domains, Ethereum)</a></li>
          <li><a target="_blank" href="https://twb.punk.domains">.wildbunch (The Wild Bunch NFT, Ethereum)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.x (Unstoppable Domains, Ethereum)</a></li>
          <li><a target="_blank" href="https://punk.domains">.xdai (Punk Domains, Gnosis Chain)</a></li>
          <li><a target="_blank" href="https://unstoppabledomains.com/">.888 (Unstoppable Domains, Ethereum)</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
<!-- END About modal -->
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
    }
  },

  setup() {
    const { open } = useBoard();
		const { address, chainId, isActivated } = useEthers();
		const { disconnect } = useWallet();
		const { getBlockExplorerBaseUrl, getChainName, getSupportedChains, switchNetwork } = useChainHelpers();
    const userStore = useUserStore();

		return {
			address,
			chainId,
			disconnect,
      getBlockExplorerBaseUrl,
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

.short-address {
  text-decoration: none;
}
</style>