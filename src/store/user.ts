import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import ResolverAbi from "../data/abi/ResolverAbi.json";
import resolvers from '../data/resolvers.json';
import useChainHelpers from "../composables/useChainHelpers";

const { address, balance, chainId, signer } = useEthers();
const { getFallbackProvider } = useChainHelpers();

export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      address: null,
      chainId: null,
      defaultDomain: null
    }
  },

  getters: {
    getDefaultDomain(state) {
      return state.defaultDomain;
    }
  },

  actions: {
    async setDefaultDomain() {
      if (this.address != address.value || this.chainId != chainId.value) {
        this.defaultDomain = null;
        this.address = address.value;
        this.chainId = chainId.value;
        
        const intfc = new ethers.utils.Interface(ResolverAbi);
        const contract = new ethers.Contract(resolvers[this.chainId], intfc, signer.value);

        // check if user owns a PD on a currently connected chain
        this.defaultDomain = await contract.getFirstDefaultDomain(this.address);

        if (!this.defaultDomain) {
          for (let netId in resolvers) {
            if (netId != this.chainId) {
              let provider = getFallbackProvider(netId);
              let contractResolver = new ethers.Contract(resolvers[netId], intfc, provider);

              this.defaultDomain = await contractResolver.getFirstDefaultDomain(this.address);

              if (this.defaultDomain) {
                console.log("Default domain", this.defaultDomain ,"found on chain", netId);
                break;
              }
            }
          }
        }

        if (!this.defaultDomain) {
          // @todo
          // if still not found, check ENS & UD
        }
      }
      
    }
  }
})