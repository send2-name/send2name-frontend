import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import ResolverAbi from "../data/abi/ResolverAbi.json";
import resolvers from '../data/resolvers.json';
import useChainHelpers from "./useChainHelpers";

const { chainId, signer } = useEthers();
const { getFallbackProvider } = useChainHelpers();

export default function useDomainHelpers() {

  async function getPunkDomain(address) {
    let defaultDomain = null;

    const intfc = new ethers.utils.Interface(ResolverAbi);
    const contract = new ethers.Contract(resolvers[chainId.value], intfc, signer.value);

    // check if user owns a PD on a currently connected chain
    defaultDomain = await contract.getFirstDefaultDomain(address);

    if (!defaultDomain) {
      for (let netId in resolvers) {
        if (Number(netId) != chainId.value) {
          let provider = getFallbackProvider(netId);
          let contractResolver = new ethers.Contract(resolvers[netId], intfc, provider);

          defaultDomain = await contractResolver.getFirstDefaultDomain(address);

          if (defaultDomain) {
            console.log("Default domain", defaultDomain ,"found on chain", netId);
            break;
          }
        }
      }
    }

    return defaultDomain;
  }

  // RETURN
  return {
    getPunkDomain
  }
}