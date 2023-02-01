<template>
<div class="d-flex justify-content-center">
<div class="card text-white bg-primary mb-3 send-tokens-card">
  <div class="card-body text-center">

    <button
      v-if="!isActivated" 
      class="btn btn-primary" 
      type="button"
      data-bs-toggle="modal" 
      data-bs-target="#connectModal"
    >
      Connect wallet
    </button>

    <!-- Select network -->
    <button 
      v-if="isActivated" 
      class="btn btn-primary dropdown-toggle" 
      type="button" 
      data-bs-toggle="dropdown" 
      aria-expanded="false"
    >
      <span v-if="!getChainName(chainId).toLowerCase().startsWith('unsupported')">SEND ON </span>
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
    <div class="mt-4">
      <input 
        v-model="receiver"
        class="form-control form-control-lg text-center"
        placeholder="Receiver's domain name"
      >
    </div>
    <!-- END Recipient -->

    <!-- Token amount -->
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
    <!-- END Token amount -->

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
      v-if="isActivated"
      class="btn btn-lg btn-dark mt-4 mb-2"
      :disabled="notValid || waiting"
      @click="send"
    >
      <span v-if="waiting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Send tokens
    </button>
    <!-- END send button -->

    <!-- Connect wallet button -->
    <button
      v-if="!isActivated"
      class="btn btn-lg btn-dark mt-4 mb-2"
      data-bs-toggle="modal" 
      data-bs-target="#connectModal"
    >
      Connect wallet
    </button>
    <!-- END Connect wallet button -->

  </div>
</div>
</div>
</template>

<script>
import WaitingToast from "./WaitingToast.vue";
import useChainHelpers from "../composables/useChainHelpers";
import useDomainHelpers from "../composables/useDomainHelpers";
import Erc20Abi from "../data/abi/Erc20Abi.json";
import tokens from "../data/tokens.json";
import { ethers } from 'ethers';
import { useBoard, useEthers } from 'vue-dapp';
import { useToast, TYPE } from "vue-toastification";

export default {
  name: "SendTokens",

  data() {
    return {
      filterNetwork: null,
      filterTokens: null,
      receiver: null,
      receiverAddress: null,
      tokenBalance: 0, // max token balance of sender
      selectedToken: null,
      selectedTokenDecimals: null,
      tokenAmount: null, // amount to be sent
      waiting: false
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
      if (this.getTokens) {
        this.selectedToken = Object.keys(this.getTokens)[0];

        if (this.isActivated) {
          this.getTokenBalance(this.selectedToken);
        }
        
      }
    },

    async send() {
      this.waiting = true;
      
      const holder = await this.getDomainHolder(this.receiver);
      
      if (!holder || holder === ethers.constants.AddressZero) {
        this.toast("This name does not have an owner. Sending aborted.", {type: TYPE.ERROR});
        this.waiting = false;
        return;
      }

      if (holder.toLowerCase() === this.address.toLowerCase()) {
        this.toast("The receiver name is yours. You cannot send tokens to yourself.", {type: TYPE.ERROR});
        this.waiting = false;
        return;
      }

      this.receiverAddress = holder; // set the receiver address

      // send tokens
      if (this.getTokens[this.selectedToken] === "0x0") {
        this.sendNativeTokens(); // ETH or other chain native token
      } else {
        this.sendErc20Tokens();
      }
    },

    async sendErc20Tokens() {
      
      try {
        const sToken = this.selectedToken;
        const tAmount = this.tokenAmount;
        const recDomain = this.receiver;

        const valueWei = ethers.utils.parseUnits(tAmount, this.selectedTokenDecimals);
        const tokenAddr = this.getTokens[sToken];
        
        const intfc = new ethers.utils.Interface(Erc20Abi);
        const tokenContract = new ethers.Contract(tokenAddr, intfc, this.signer);

        const tx = await tokenContract.transfer(this.receiverAddress, valueWei);
        
        const toastWait = this.toast(
          {
            component: WaitingToast, // @todo
            props: {
              text: "Please wait for your transaction to confirm. Click on this notification to see transaction in the block explorer."
            }
          },
          {
            type: TYPE.INFO,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          this.toast.dismiss(toastWait);
          this.toast("You have successfully sent " + tAmount + " " + sToken + " to " + recDomain + "!", {
            type: TYPE.SUCCESS,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          this.waiting = false;
          this.getTokenBalance(sToken);

        } else {
          this.toast.dismiss(toastWait);

          this.toast("Transaction has failed.", {
            type: TYPE.ERROR,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });

          console.log(receipt);
          this.waiting = false;
        }
      } catch (e) {
        this.waiting = false;
        console.log(e);
        this.toast(e.message, {type: TYPE.ERROR});
      }
    },

    async sendNativeTokens() {
      // ETH or other chain native token
      this.waiting = true;

      try {
        const sToken = this.selectedToken;
        const tAmount = this.tokenAmount;
        const recDomain = this.receiver;
        const valueWei = ethers.utils.parseEther(tAmount);
        
        const tx = await this.signer.sendTransaction({
          to: this.receiverAddress,
          value: valueWei
        });
        
        const toastWait = this.toast(
          {
            component: WaitingToast,
            props: {
              text: "Please wait for your transaction to confirm. Click on this notification to see transaction in the block explorer."
            }
          },
          {
            type: TYPE.INFO,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          }
        );

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          this.toast.dismiss(toastWait);
          this.toast("You have successfully sent " + tAmount + " " + sToken + " to " + recDomain + "!", {
            type: TYPE.SUCCESS,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });
          this.waiting = false;
          this.getTokenBalance(sToken);
        } else {
          this.toast.dismiss(toastWait);
          this.toast("Transaction has failed.", {
            type: TYPE.ERROR,
            onClick: () => window.open(this.getBlockExplorerBaseUrl(this.chainId)+"/tx/"+tx.hash, '_blank').focus()
          });
          console.log(receipt);
          this.waiting = false;
        }
      } catch (e) {
        this.waiting = false;
        console.log(e);
        this.toast(e.message, {type: TYPE.ERROR});
      }
    },
  },

  setup() {
    const { open } = useBoard();
    const { address, balance, chainId, isActivated, signer } = useEthers();
    const { getBlockExplorerBaseUrl, getChainName, getSupportedChains, switchNetwork } = useChainHelpers();
    const { getDomainHolder } = useDomainHelpers();
    const toast = useToast();

    return { 
      address, balance, chainId, getBlockExplorerBaseUrl, getChainName, getDomainHolder, getSupportedChains, 
      isActivated, open, signer, switchNetwork, toast 
    }
  },

  watch: {
    address() {
      this.setData();
    },

    chainId() {
      this.setData();
    },
    
    isActivated() {
      this.setData();
    }
  }

}
</script>

<style scoped>
#balance {
  text-decoration: underline;
  cursor: pointer;
}

#balance:hover {
  text-decoration: none;
}

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