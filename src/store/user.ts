import { defineStore } from 'pinia';
import { useEthers } from 'vue-dapp';
import { ethers } from 'ethers';
import useDomainHelpers from "../composables/useDomainHelpers";
import tokens from "../data/tokens.json";
import Erc20Abi from "../data/abi/Erc20Abi.json";

const { address, balance, chainId, signer } = useEthers();
const { getEnsDomain, getPunkDomain } = useDomainHelpers();

export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      address: null,
      chainId: null,
      defaultDomain: null,
      domainSearchStatus: false, // is a domain search for the connected user still in progress?
      tokenBalances: null,
      tokenLoadingStatus: false // is loading token balances for the connected user still in progress?
    }
  },

  getters: {
    getDefaultDomain(state) {
      return state.defaultDomain;
    },

    getDomainSearchStatus(state) {
      return state.domainSearchStatus;
    },

    getTokenBalances(state) {
      return state.tokenBalances;
    },

    getTokenLoadingStatus(state) {
      return state.tokenLoadingStatus;
    }
  },

  actions: {
    async fetchTokenBalances() {
      this.tokenLoadingStatus = true;

      if (!this.tokenBalances) {
        // if tokenBalances is null, open tokens.json and store the contents in tokenBalances
        this.tokenBalances = JSON.parse(JSON.stringify(tokens)); // deep copy the tokens object!!!
      }

      const intfc = new ethers.utils.Interface(Erc20Abi);

      for (let ticker in this.tokenBalances[String(chainId.value)]) {
        let tokenAddr = tokens[String(chainId.value)][ticker];

        if (tokenAddr === "0x0") {
          this.tokenBalances[String(chainId.value)][ticker] = ethers.utils.formatEther(balance.value); // ETH or other chain native token
        } else {
          let tokenContract = new ethers.Contract(tokenAddr, intfc, signer.value);
          let balanceWei = await tokenContract.balanceOf(address.value);

          if (Number(balanceWei) > 0) {
            let decimals = await tokenContract.decimals();
            this.tokenBalances[String(chainId.value)][ticker] = ethers.utils.formatUnits(balanceWei, Number(decimals));
          } else {
            this.tokenBalances[String(chainId.value)][ticker] = 0;
          }
        }
      }

      this.tokenLoadingStatus = false;
    },

    async setDefaultDomain() {
      if (this.address != address.value || this.chainId != chainId.value) {
        this.domainSearchStatus = true;

        this.fetchTokenBalances(); // also fetch token balances

        console.log("start searching for domain");
        this.defaultDomain = null;
        this.address = address.value;
        this.chainId = chainId.value;

        console.log("start Punk Domain (PD) search");

        // first check if user owns a punk domain
        this.defaultDomain = await getPunkDomain(this.address);

        console.log("PD search result:", this.defaultDomain);

        if (!this.defaultDomain) {
          console.log("Start ENS search");

          // ENS
          this.defaultDomain = await getEnsDomain(this.address);

          console.log("ENS search result:", this.defaultDomain);

          // @todo
          // if no ENS domain found, check UD
        }
        
        this.domainSearchStatus = false;
      }
      
    }
  }
})