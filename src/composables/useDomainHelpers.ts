import { ethers } from 'ethers';
import { useEthers } from 'vue-dapp';
import { Resolution } from '@unstoppabledomains/resolution';
import ResolverAbi from "../data/abi/ResolverAbi.json";
import domains from '../data/domains.json';
import resolvers from '../data/resolvers.json';
import useChainHelpers from "./useChainHelpers";

const { chainId, signer } = useEthers();
const { getFallbackProvider } = useChainHelpers();

export default function useDomainHelpers() {

  async function getDomainHolder(domain) {
    const domainParts = domain.toLowerCase().split(".");

    console.log("Domain name:", domainParts[0]);
    console.log("Domain extension:", domainParts[1]);

    const domainData = domains["."+domainParts[1]];

    if (!domainData) {
      return null;
    }

    console.log("Domain data:", domainData.protocol);

    const provider = getFallbackProvider(domainData.chainId);

    if (domainData.protocol === "ENS") {
      return provider.resolveName(domain);
    } else if (domainData.protocol === "PD") { // Punk Domains
      const tldInterface = new ethers.utils.Interface([
        "function getDomainHolder(string) public view returns(address)"
      ]);

      const tldContract = new ethers.Contract(domainData.address, tldInterface, provider);

      return tldContract.getDomainHolder(domainParts[0]);
    } else if (domainData.protocol === "UD") { // Unstoppable Domains
      const resolution = new Resolution({
        sourceConfig: {
          uns: {
            locations: {
              Layer1: {
                url: "https://1rpc.io/eth",
                network: 'mainnet'
              },
              Layer2: {
                url: "https://1rpc.io/matic",
                network: 'polygon-mainnet',
              },
            },
          },
        },
      });

      return resolution.addr(domain, "ETH");
    }
  }

  async function getEnsDomain(address) {
    let provider = getFallbackProvider("1"); // get Ethereum provider

    return provider.lookupAddress(address);
  }

  async function getPunkDomain(address) {
    let defaultDomain = null;
    const intfc = new ethers.utils.Interface(ResolverAbi);
    let resolverAddress = resolvers[chainId.value];

    if (resolverAddress) {
      const contract = new ethers.Contract(resolvers[chainId.value], intfc, signer.value);

      // check if user owns a PD on a currently connected chain
      defaultDomain = await contract.getFirstDefaultDomain(address);
    }

    if (!defaultDomain) {
      for (let netId in resolvers) {
        console.log("Punk Domain search on chain with ID", netId);

        if (Number(netId) != chainId.value) {
          let provider = getFallbackProvider(netId);
          let contractResolver = new ethers.Contract(resolvers[netId], intfc, provider);

          defaultDomain = await contractResolver.getFirstDefaultDomain(address);

          if (defaultDomain) {
            console.log("Default punk domain", defaultDomain ,"found on chain", netId);
            break;
          }
        }
      }
    }

    return defaultDomain;
  }

  // RETURN
  return {
    getDomainHolder,
    getEnsDomain,
    getPunkDomain
  }
}