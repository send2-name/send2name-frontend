import { ethers } from 'ethers';

export default function useChainHelpers() {

  function getBlockExplorerBaseUrl(networkId) {
    let chain = chains.find(chain => chain.chainId == networkId);
    return chain.blockExplorer;
  }

  function getChainName(chainId) {
    let chain = chains.find(chain => chain.chainId == chainId);

    if (chain) {
      return chain.name.toUpperCase();
    }
    
    return "Unsupported Network".toUpperCase();
  }

  function getFallbackProvider(networkId) {
    let chain = chains.find(chain => chain.chainId == networkId);
    let urls = [chain.rpc1];

    if (urls) {
      const providers = urls.map(url => new ethers.providers.JsonRpcProvider(url));
      return new ethers.providers.FallbackProvider(providers, 1); // return fallback provider
    } else {
      return null;
    }
  }

  function getResolver(chainId) {
    let chain = chains.find(chain => chain.chainId == chainId);
    return chain.resolver;
  }

  function getResolversList() {
    let resolvers = chains.map(chain => chain.resolver);
    return resolvers;
  }

  function getSupportedChains() {
    // get chain names, turn to uppercase and return array

    let chainNames = chains.map(chain => chain.name.toUpperCase());
    return chainNames;
  }

  async function switchOrAddChain(ethereum, networkName) {
    // get network id from chains
    let chain = chains.find(chain => chain.name.toUpperCase() == networkName);
    let chainId = chain.chainId;

    try {
      await ethereum.request({
        "method": "wallet_switchEthereumChain",
        "params": [
          {
            "chainId": ethers.utils.hexValue(chainId)
          }
        ]
      });
    } catch (error) {
      if (error.code === 4902) {
        await ethereum.request({
          "method": "wallet_addEthereumChain",
          "params": [
            {
              "chainId": ethers.utils.hexValue(chainId),
              "chainName": networkName,
              "nativeCurrency": {
                "name": chain.currency,
                "symbol": chain.currency,
                "decimals": 18
              },
              "rpcUrls": [chain.rpc2],
              "blockExplorerUrls": [chain.blockExplorer]
            }
          ]
        });
      }
    }
  }

  // RETURN
  return {
    getBlockExplorerBaseUrl,
    getChainName,
    getFallbackProvider,
    getResolver,
    getResolversList,
    getSupportedChains,
    switchOrAddChain
  }
}

const chains = [
  { chainId: 666666666, name: "Degen", currency: "DEGEN", rpc1: "https://rpc.degen.tips", rpc2: "https://rpc.degen.tips", blockExplorer: "https://explorer.degen.tips", resolver: "0xeA2f99fE93E5D07F61334C5Eb9c54c5D5C957a6a" },
  { chainId: 1, name: "Ethereum", currency: "ETH", rpc1: "https://rpc.ankr.com/eth", rpc2: "https://1rpc.io/eth", blockExplorer: "https://etherscan.io", resolver: "0x985ecBD12566dD8BC05F4Df96729Ee84dE67F519" },
  { chainId: 10, name: "Optimism", currency: "ETH", rpc1: "https://optimism-mainnet.public.blastapi.io", rpc2: "https://rpc.ankr.com/optimism", blockExplorer: "https://optimistic.etherscan.io", resolver: "0xF20fc12a4955c9d47194B8fEd591Fe01777D2b06" },
  { chainId: 14, name: "Flare", currency: "FLR", rpc1: "https://flare-api.flare.network/ext/C/rpc", rpc2: "https://flare-api.flare.network/ext/C/rpc", blockExplorer: "https://flare-explorer.flare.network", resolver: "0x2919f0bE09549814ADF72fb0387D1981699fc6D4" },
  { chainId: 16, name: "Coston Testnet", currency: "CFLR", rpc1: "https://coston-api.flare.network/ext/C/rpc", rpc2: "https://coston-api.flare.network/ext/C/rpc", blockExplorer: "https://coston-explorer.flare.network", resolver: "" },
  { chainId: 19, name: "Songbird", currency: "SGB", rpc1: "https://songbird-api.flare.network/ext/C/rpc", rpc2: "https://sgb.ftso.com.au/ext/bc/C/rpc", blockExplorer: "https://songbird-explorer.flare.network", resolver: "0x7e8aB50697C7Abe63Bdab6B155C2FB8D285458cB" },
  { chainId: 56, name: "BNB Smart Chain", currency: "BNB", rpc1: "https://rpc.ankr.com/bsc", rpc2: "https://bsc-dataseed.binance.org", blockExplorer: "https://bscscan.com", resolver: "0x4aBf8b364ac4aF048Ea077AAA2EDF3e1e1EC0f9c" },
  { chainId: 100, name: "Gnosis Chain", currency: "XDAI", rpc1: "https://rpc.ankr.com/gnosis", rpc2: "https://rpc.ankr.com/gnosis", blockExplorer: "https://gnosisscan.io", resolver: "0x4Ef2f5fE2211125b3cadca7FeaE4534D02C29e17" },
  { chainId: 137, name: "Polygon", currency: "MATIC", rpc1: "https://rpc.ankr.com/polygon", rpc2: "https://rpc.ankr.com/polygon", blockExplorer: "https://polygonscan.com", resolver: "0x07884566cdED43eDaec7813C1523624202b060D3" },
  { chainId: 250, name: "Fantom", currency: "FTM", rpc1: "https://rpc.ankr.com/fantom", rpc2: "https://rpc.ankr.com/fantom", blockExplorer: "https://ftmscan.com", resolver: "0xa97c7AF10ee564EBf452A9347bB9653454Ba69C0" },
  { chainId: 8453, name: "Base", currency: "ETH", rpc1: "https://mainnet.base.org", rpc2: "https://mainnet.base.org", blockExplorer: "https://basescan.org", resolver: "0xeA2f99fE93E5D07F61334C5Eb9c54c5D5C957a6a" },
  { chainId: 34443, name: "Mode", currency: "ETH", rpc1: "https://mainnet.mode.network", rpc2: "https://1rpc.io/mode", blockExplorer: "https://explorer.mode.network", resolver: "0x4aBf8b364ac4aF048Ea077AAA2EDF3e1e1EC0f9c" },
  { chainId: 42161, name: "Arbitrum", currency: "ETH", rpc1: "https://rpc.ankr.com/arbitrum", rpc2: "https://rpc.ankr.com/arbitrum", blockExplorer: "https://arbiscan.io", resolver: "0xd64A2DF9d73CD1Cb50139A3eC3176070e00C67cA" },
  { chainId: 42170, name: "Arbitrum Nova", currency: "ETH", rpc1: "https://arbitrum-nova.public.blastapi.io", rpc2: "https://nova.arbitrum.io/rpc", blockExplorer: "https://nova.arbiscan.io", resolver: "0xeA2f99fE93E5D07F61334C5Eb9c54c5D5C957a6a" },
  { chainId: 42766, name: "ZKFair", currency: "USDC", rpc1: "https://rpc.zkfair.io", rpc2: "https://rpc.zkfair.io", blockExplorer: "https://scan.zkfair.io", resolver: "0xeA2f99fE93E5D07F61334C5Eb9c54c5D5C957a6a" },
  { chainId: 55244, name: "Superposition", currency: "ETH", rpc1: "https://rpc.superposition.so", rpc2: "https://rpc.superposition.so", blockExplorer: "https://explorer.superposition.so", resolver: "0xC6c17896fa051083324f2aD0Ed4555dC46D96E7f" },
  { chainId: 81457, name: "Blast", currency: "ETH", rpc1: "https://rpc.blast.io", rpc2: "https://rpc.ankr.com/blast", blockExplorer: "https://blastscan.io", resolver: "0x0F081cad5BCed7B2acA1c1D22CdafcB21322B280" },
  { chainId: 534352, name: "Scroll", currency: "ETH", rpc1: "https://rpc.scroll.io", rpc2: "https://1rpc.io/scroll", blockExplorer: "https://scrollscan.com", resolver: "0xeA2f99fE93E5D07F61334C5Eb9c54c5D5C957a6a" },
];