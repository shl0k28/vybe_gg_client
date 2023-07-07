import { ethers } from 'ethers';
import axios from 'axios';
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

export const getFunctionSignature = async (chainName:string,transactionTo: any,transactionHash:any) => {
    let provider = new ethers.providers.JsonRpcProvider(chainName === 'eth-mainnet' ? ethMainnetProviderUrl : maticMainnetProviderUrl);
    try{
        const transaction = await provider.getTransaction(transactionHash);
        const contractCode = await provider.getCode(transactionTo);

        if (!transaction || !contractCode) {
            console.log('Invalid transaction hash or contract address.');
            return;
        }

        const input = transaction.data;
        const functionSignature = input.slice(0, 10);

        console.log('Function Signature Hex :', functionSignature);
        const func_sig = await getTextSignature(functionSignature);
        console.log('Text Signature:',func_sig);
        return func_sig;
    }   
    catch (error) {
        console.error('Error:', error);
    }
}

async function getTextSignature(functionSignature: string) {
    try {
      const apiUrl = `https://www.4byte.directory/api/v1/signatures/?hex_signature=${functionSignature}`;
      const response = await axios.get(apiUrl);
      const { count, results } = response.data;
  
      if (count > 0 && results.length > 0) {
        console.log('Text Signature:', results[0].text_signature);
        return results[0].text_signature.split('(')[0];
      } else {
        console.log('Text Signature: Unknown');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }