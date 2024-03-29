import { ethers } from 'ethers';
import rpcs from '../data/rpcs.json';
import explorers from '../data/explorers.json';

export default function useChainHelpers() {

  function getBlockExplorerBaseUrl(networkId) {
    return explorers[String(networkId)];
  }

  function getSupportedChains() {
    return [
      "Arbitrum".toUpperCase(),
      "Arbitrum Nova".toUpperCase(),
      "Base".toUpperCase(),
      "BNB Smart Chain".toUpperCase(),
      "Ethereum".toUpperCase(),
      "Fantom".toUpperCase(),
      "Flare".toUpperCase(),
      "Gnosis Chain".toUpperCase(),
      "Kroma".toUpperCase(),
      "Optimism".toUpperCase(),
      "Polygon".toUpperCase(),
      "Scroll".toUpperCase(),
      "Songbird".toUpperCase(),
      "ZKFair".toUpperCase(),
      "Coston Testnet".toUpperCase()
    ]
  }

  function getChainName(chainId) {
    if (chainId === 1) {
      return "Ethereum".toUpperCase();
    } else if (chainId === 10) {
      return "Optimism".toUpperCase();
    } else if (chainId === 14) {
      return "Flare".toUpperCase();
    } else if (chainId === 16) {
      return "Coston Testnet".toUpperCase();
    } else if (chainId === 19) {
      return "Songbird".toUpperCase();
    } else if (chainId === 56) {
      return "BNB Smart Chain".toUpperCase();
    } else if (chainId === 69) {
      return "Optimism Testnet".toUpperCase();
    } else if (chainId === 77) {
      return "Gnosis Testnet".toUpperCase();
    } else if (chainId === 100) {
      return "Gnosis Chain".toUpperCase();
    } else if (chainId === 137) {
      return "Polygon".toUpperCase();
    } else if (chainId === 250) {
      return "Fantom".toUpperCase();
    } else if (chainId === 255) {
      return "Kroma".toUpperCase();
    } else if (chainId === 4002) {
      return "Fantom Testnet".toUpperCase();
    } else if (chainId === 8453) {
      return "Base".toUpperCase();
    } else if (chainId === 42161) {
      return "Arbitrum".toUpperCase();
    } else if (chainId === 42170) {
      return "Arbitrum Nova".toUpperCase();
    } else if (chainId === 42766) {
      return "ZKFair".toUpperCase();
    } else if (chainId === 421611) {
      return "Arbitrum Testnet".toUpperCase();
    } else if (chainId === 421613) {
      return "Arbitrum Goerli Testnet".toUpperCase();
    } else if (chainId === 80001) {
      return "Polygon Testnet".toUpperCase();
    } else if (chainId === 534352) {
      return "Scroll".toUpperCase();
    } else if (chainId === 1313161555) {
      return "Aurora Testnet".toUpperCase();
    } else {
      return "Unsupported Network".toUpperCase();
    }
  }

  function getFallbackProvider(networkId) {
    let urls = [rpcs[String(networkId)]];

    if (urls) {
      const providers = urls.map(url => new ethers.providers.JsonRpcProvider(url));
      return new ethers.providers.FallbackProvider(providers, 1); // return fallback provider
    } else {
      return null;
    }
  }

  function switchNetwork(networkName) {
    let method;
    let params;

    if (networkName == "Ethereum".toUpperCase()) {
      method = "wallet_switchEthereumChain"
      params = [{ chainId: "0x1" }] 
    } else if (networkName == "Polygon Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://mumbai.polygonscan.com" ],
        chainId: "0x13881",
        chainName: "Mumbai Testnet",
        nativeCurrency: { decimals: 18, name: "Matic", symbol: "MATIC" }, 
        rpcUrls: ["https://matic-mumbai.chainstacklabs.com"]
      }] 
    } else if (networkName == "Arbitrum Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://testnet.arbiscan.io" ],
        chainId: "0x66EEB",
        chainName: "Arbitrum Testnet",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://rinkeby.arbitrum.io/rpc"]
      }] 
    } else if (networkName == "Arbitrum Goerli Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://goerli.arbiscan.io" ],
        chainId: "0x66EED",
        chainName: "Arbitrum Goerli Testnet".toUpperCase(),
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc"]
      }] 
    } else if (networkName == "Arbitrum".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://arbiscan.io" ],
        chainId: "0xA4B1",
        chainName: "Arbitrum One",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://1rpc.io/arb"]
      }] 
    } else if (networkName == "Arbitrum Nova".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://nova.arbiscan.io" ],
        chainId: "0xa4ba",
        chainName: "Arbitrum Nova",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://nova.arbitrum.io/rpc"]
      }] 
    } else if (networkName == "Optimism".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://optimistic.etherscan.io/" ],
        chainId: "0xA",
        chainName: "Optimism",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://1rpc.io/op"]
      }] 
    } else if (networkName == "Optimism Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://kovan-optimistic.etherscan.io/" ],
        chainId: "0x45",
        chainName: "Optimism Testnet",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://kovan.optimism.io"]
      }] 
    } else if (networkName == "Polygon".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://polygonscan.com" ],
        chainId: "0x89",
        chainName: "Polygon PoS Chain",
        nativeCurrency: { decimals: 18, name: "MATIC", symbol: "MATIC" }, 
        rpcUrls: ["https://1rpc.io/matic"]
      }] 
    } else if (networkName == "Gnosis Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://blockscout.com/poa/sokol" ],
        chainId: "0x4D",
        chainName: "Gnosis Testnet",
        nativeCurrency: { decimals: 18, name: "SPOA", symbol: "SPOA" }, 
        rpcUrls: ["https://sokol.poa.network"]
      }] 
    } else if (networkName == "Gnosis Chain".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://gnosisscan.io/" ],
        chainId: "0x64",
        chainName: "Gnosis Chain",
        nativeCurrency: { decimals: 18, name: "XDAI", symbol: "XDAI" }, 
        rpcUrls: ["https://rpc.gnosischain.com"]
      }] 
    } else if (networkName == "BNB Smart Chain".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://bscscan.com/" ],
        chainId: "0x38",
        chainName: "BNB Smart Chain",
        nativeCurrency: { decimals: 18, name: "BNB", symbol: "BNB" }, 
        rpcUrls: ["https://1rpc.io/bnb"]
      }] 
    } else if (networkName == "Aurora Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://testnet.aurorascan.dev/" ],
        chainId: "0x4E454153",
        chainName: "Aurora Testnet",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://testnet.aurora.dev"]
      }] 
    } else if (networkName == "Songbird".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://songbird-explorer.flare.network/" ],
        chainId: "0x13",
        chainName: "Songbird",
        nativeCurrency: { decimals: 18, name: "SGB", symbol: "SGB" }, 
        rpcUrls: ["https://songbird-api.flare.network/ext/C/rpc"]
      }] 
    } else if (networkName == "Fantom".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://ftmscan.com" ],
        chainId: "0xFA",
        chainName: "Fantom",
        nativeCurrency: { decimals: 18, name: "FTM", symbol: "FTM" }, 
        rpcUrls: ["https://1rpc.io/ftm"]
      }] 
    } else if (networkName == "Fantom Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://testnet.ftmscan.com" ],
        chainId: "0xFA2",
        chainName: "Fantom Testnet",
        nativeCurrency: { decimals: 18, name: "FTM", symbol: "FTM" }, 
        rpcUrls: ["https://rpc.ankr.com/fantom_testnet"]
      }] 
    } else if (networkName == "Coston Testnet".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://coston-explorer.flare.network" ],
        chainId: "0x10",
        chainName: "Coston Testnet",
        nativeCurrency: { decimals: 18, name: "FLR", symbol: "FLR" }, 
        rpcUrls: ["https://coston-api.flare.network/ext/C/rpc"]
      }] 
    } else if (networkName == "Flare".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://flare-explorer.flare.network" ],
        chainId: "0xE",
        chainName: "Flare",
        nativeCurrency: { decimals: 18, name: "FLR", symbol: "FLR" }, 
        rpcUrls: ["https://flare-api.flare.network/ext/C/rpc"]
      }] 
    } else if (networkName == "Base".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://basescan.org" ],
        chainId: "0x2105",
        chainName: "Base",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://mainnet.base.org"]
      }] 
    } else if (networkName == "Kroma".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://kromascan.com" ],
        chainId: "0xff",
        chainName: "Kroma",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://api.kroma.network"]
      }] 
    } else if (networkName == "Scroll".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://scrollscan.com" ],
        chainId: "0x82750",
        chainName: "Scroll",
        nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" }, 
        rpcUrls: ["https://rpc.scroll.io"]
      }] 
    } else if (networkName == "ZKFair".toUpperCase()) {
      method = "wallet_addEthereumChain"
      params = [{ 
        blockExplorerUrls: [ "https://scan.zkfair.io" ],
        chainId: "0xa70e",
        chainName: "ZKFair",
        nativeCurrency: { decimals: 18, name: "USDC", symbol: "USDC" }, 
        rpcUrls: ["https://rpc.zkfair.io"]
      }] 
    }

    return { 
      method: method, 
      params: params
    }
  }

  // RETURN
  return {
    getBlockExplorerBaseUrl,
    getChainName,
    getFallbackProvider,
    getSupportedChains,
    switchNetwork
  }
}