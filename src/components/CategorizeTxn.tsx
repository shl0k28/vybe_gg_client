import { ethers } from 'ethers';

let ethMainnetProviderUrl = "https://eth-mainnet.g.alchemy.com/v2/LatuiPPNGhXoq-yKXOr75pOLko1WxUxN"
let maticMainnetProviderUrl = "https://polygon-mainnet.g.alchemy.com/v2/s5BwByPukIVosEOZEfXU68neTN4WsDOy"

export const categorizeTransaction = async (chainName: string,transactionHash:any) => {
    let provider = new ethers.providers.JsonRpcProvider(chainName === 'eth-mainnet' ? ethMainnetProviderUrl : maticMainnetProviderUrl);
    let tx = await provider.getTransaction(transactionHash);
    if(tx?.to === null) {
        return 'Contract Creation';
    }
    else if(tx?.data === '0x') {
        return 'Transfer';
    }
    else {
        let methodSignature = tx?.data.substring(0, 10);
        if(methodSignature === '0xa9059cbb') {
            return 'ERC-20 Transfer';
        }
        else if(methodSignature === '0x23b872dd') {
            return 'NFT Transfer';
        }
        else {
            return 'Contract Call';
        }
    }
}