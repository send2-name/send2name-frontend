import { defineStore } from 'pinia';
import { useEthers } from 'vue-dapp';
import useDomainHelpers from "../composables/useDomainHelpers";

const { address, chainId } = useEthers();
const { getEnsDomain, getPunkDomain } = useDomainHelpers();

export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      address: null,
      chainId: null,
      defaultDomain: null,
      domainSearchStatus: false // is a domain search for the connected user in progress?
    }
  },

  getters: {
    getDefaultDomain(state) {
      return state.defaultDomain;
    },

    getDomainSearchStatus(state) {
      return state.domainSearchStatus;
    },
  },

  actions: {
    async setDefaultDomain() {
      if (this.address != address.value || this.chainId != chainId.value) {
        this.domainSearchStatus = true;

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