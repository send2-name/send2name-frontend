<template>
<div class="d-flex justify-content-center">
<div class="card text-white bg-primary mb-3 send-tokens-card">
  <div class="card-body text-center">

    <!-- Select network -->
    <button 
      class="btn btn-primary dropdown-toggle" 
      type="button" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
    >
      SEND ON {{ getChainName(chainId) }}
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
    <div class="mt-4">
      <input 
        v-model="receiver"
        class="form-control form-control-lg text-center"
        placeholder="Receiver's domain name"
      >
    </div>
    <!-- END Recipient -->

    <!-- Tokens -->
    <div class="input-group mt-3">
      <input 
        type="text" 
        class="form-control form-control-lg text-end"
        v-model="tokenAmount"
        placeholder="0.0" 
      />

      <button 
        class="btn btn-dark dropdown-toggle" 
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        {{selectedToken}}
      </button>
          
      <div class="dropdown-menu p-2 dropdown-menu-end">
        <div class="mb-3">
          <input 
            class="form-control mb-2" 
            placeholder="Filter tokens"
            v-model="filterTokens" 
          />

          <li>
            <button 
              class="dropdown-item" 
              type="button"
              :key="token"
              v-for="token in getTokenNames"
              @click="selectToken(token)"
            >{{token}}</button>
          </li>
        </div>
      </div>
    </div>
    <!-- END tokens -->

    <!-- Balance -->
    <div>
      <small>
      Balance: 
      <span id="balance" @click="tokenAmount=tokenBalance">{{formatTokenBalance}} {{selectedToken}}</span>
    </small>
    </div>
    <!-- END Balance -->

    <!-- Send button -->
    <button
      class="btn btn-lg btn-dark mt-4 mb-2"
      :disabled="notValid || waiting"
      @click="validateDomainName"
      data-bs-toggle="modal" data-bs-target="#sendTokensModal"
    >
      <span v-if="waiting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Send tokens
    </button>
    <!-- END send button -->

  </div>
</div>
</div>
</template>

<script>
import useChainHelpers from "../composables/useChainHelpers";
import tokens from "../data/tokens.json";
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';

export default {
  name: "SendTokens",

  data() {
    return {
      domainError: null,
      filterNetwork: null,
      filterTokens: null,
      receiver: null,
      receiverAddress: null,
      tokenBalance: 0, // max token balance of sender
      selectedToken: null,
      selectedTokenDecimals: null,
      tokenAmount: null, // amount to be sent
      waiting: false,
      validating: false
    }
  },

  created() {
    this.setData();
  },

  computed: {
    domainLowerCase() {
      if (this.receiver) {
        return this.receiver.toLowerCase();
      }
      
      return null;
    },

    formatTokenBalance() {
      if (this.tokenBalance > 100) {
        return Number(this.tokenBalance).toFixed(2);
      } else {
        return Number(this.tokenBalance).toFixed(4);
      }
    },

    getNetworks() {
      const networkNames = this.getSupportedChains();

      if (this.filterNetwork) {
        return networkNames.filter(item => item.includes(this.filterNetwork.toUpperCase())); //filtered
      }

      return networkNames;
    },

    getTokenNames() {
      if (this.getTokens && !this.filterTokens) {
        return Object.keys(this.getTokens); // all tokens
      } else if (this.getTokens && this.filterTokens) {
        return Object.keys(this.getTokens).filter(item => item.includes(this.filterTokens.toUpperCase())); //filtered
      } 
    },

    getTokens() {
      if (this.chainId) {
        return tokens[String(this.chainId)];
      }
      
      return [];
    },

    notValid() {
      if (!this.receiver) {
        return true;
      } else if (!this.receiver.includes(".")) {
        return true;
      } else if (this.receiver.includes(" ")) {
        return true;
      } else if (this.receiver.includes("%")) {
        return true;
      } else if (this.receiver.includes("&")) {
        return true;
      } else if (this.receiver.includes("?")) {
        return true;
      } else if (this.receiver.includes("#")) {
        return true;
      } else if (this.receiver.includes("/")) {
        return true;
      } else if (!this.tokenAmount) {
        return true;
      } else if (isNaN(this.tokenAmount)) {
        return true;
      } else if (Number(this.tokenAmount) <= 0) {
        return true;
      } else if (Number(this.tokenAmount) > Number(this.tokenBalance)) {
        return true;
      }
      return false;
    }
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

    async getTokenBalance(tokenName) {
      const tokenAddr = this.getTokens[tokenName];

      if (tokenAddr === "0x0") { // ETH or other chain native token
        this.tokenBalance = ethers.utils.formatEther(this.balance); // ETH or other chain native token
      } else {
        const intfc = new ethers.utils.Interface(Erc20Abi);
        const tokenContract = new ethers.Contract(tokenAddr, intfc, this.signer);
        const balanceWei = await tokenContract.balanceOf(this.address);
        if (Number(balanceWei) > 0) {
          const decimals = await tokenContract.decimals();
          this.selectedTokenDecimals = Number(decimals);
          this.tokenBalance = ethers.utils.formatUnits(balanceWei, this.selectedTokenDecimals);
        } else {
          this.tokenBalance = 0;
        }
      }
    },

    selectToken(tokenName) {
      this.selectedToken = tokenName;
      this.getTokenBalance(tokenName);
    },

    setData() {
      if (this.isActivated && this.getTokens) {
        this.selectedToken = Object.keys(this.getTokens)[0];
        //this.tokenBalance = this.getUserBalance;
        //this.getTokenBalance(this.selectedToken);
      }
    }
  },

  setup() {
    const { address, chainId, isActivated } = useEthers();
    const { getChainName, getSupportedChains, switchNetwork } = useChainHelpers();

    return { address, chainId, getChainName, getSupportedChains, isActivated, switchNetwork }
  },

  watch: {
    address() {
      this.setData();
    },
    balance() {
      this.setData();
    },
    getChainId() {
      this.setData();
    }
  }

}
</script>

<style scoped>
.send-tokens-card {
  width: 500px;
  margin-top: 25px;
}

@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .send-tokens-card {
    width: 100%;
    margin: 5px;
    margin-top: 15px;
  }
}
</style>