import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useParams } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJs, registerables } from 'chart.js'
import { Button, Box, HStack, VStack, Stack, Heading, Text, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount,useNetwork } from 'wagmi'
import { categorizeTransaction } from '@/components/CategorizeTxn'
import { getFunctionSignature } from '@/components/CategorizeTxn'

const WalletInfo: NextPage = () => {
    
    ChartJs.register(...registerables)

    const queryClient = useQueryClient()
    const router = useRouter()
    
    // const address = `0x7eb413211a9de1cd2fe8b8bb6055636c43f7d206`
    // 0x816fe884C2D2137C4F210E6a1d925583fa4A917d
    // local state
    const [portfolioData, setPortfolioData] = useState<Record<string, Array<number>>>({})
    const [nftBalances, setNftBalances] = useState<Record<string, any>>({})
    const [tokenBalances, setTokenBalances] = useState<Record<string, any>>({})
    const [userTransactions, setUserTransactions] = useState<Record<string, any>>({})
    const [transactionCategories, setTransactionCategories] = useState<Record<string, any>>({})
    
    const [txnFunction, setTxnFunction] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true); // Add loading state
    const [userAddress, setUserAddress] = useState<string>('')
    
    const { address } : any = useAccount()
    const { chain } : any = useNetwork()

    useEffect(() => {
        if (address) {
            setUserAddress(address)
        }
    }, [address, chain])

    // get portfolio data
    const getHistoricalPortfolio = async (chainName: string, address: string) => {
        let url = `http://localhost:8080/api/fetch/portfolio?chainName=${chainName}&address=${address}`
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        setPortfolioData((prevData) => ({ ...prevData, [chainName]: data }))
        return data
    }

    // get nft balances
    const getNftBalances = async (chainName: string, address: string) => {
        let url = `http://localhost:8080/api/fetch/nftBalance?chainName=${chainName}&address=${address}`
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        setNftBalances((prevData) => ({ ...prevData, [chainName]: data }))
        return data
    }

    // get token balances
    const getTokenBalances = async (chainName: string, address: string) => {
        let url = `http://localhost:8080/api/fetch/tokenBalance?chainName=${chainName}&address=${address}`
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        setTokenBalances((prevData) => ({ ...prevData, [chainName]: data }))
        return data
    }

    // get user transaction history
    const getUserTransactions = async (chainName: string, address: string) => {
        let url = `http://localhost:8080/api/fetch/transactions?chainName=${chainName}&address=${address}`
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        setUserTransactions((prevData) => ({ ...prevData, [chainName]: data }))
        return data
    }
    

    // const portfolioDataQuery = useQuery({ queryKey: ['history'], 
    //     queryFn: () => getHistoricalPortfolio('matic-mainnet', user as string)
    // })

    // const nftBalancesQuery = useQuery({ queryKey: ['nftBalances'],
    //     queryFn: () => getNftBalances('matic-mainnet', user as string) 
    // })

    // const tokenBalanceQuery = useQuery({ queryKey: ['tokenBalances'],
    //     queryFn: () => getTokenBalances('matic-mainnet', user as string)    
    // })

    // const userTransactionsQuery = useQuery({ queryKey: ['userTransactions'],
    //     queryFn: () => getUserTransactions('matic-mainnet', user as string)
    // })

    useEffect(() => {
        const fetchData = async () => {
            if (address) {
                const chains = ['eth-mainnet', 'matic-mainnet','matic-mumbai'] // Add more networks
                await Promise.all(
                    chains.map((chainName) =>
                        Promise.all([
                            getHistoricalPortfolio(chainName, address),
                            getNftBalances(chainName, address),
                            getTokenBalances(chainName, address),
                            getUserTransactions(chainName, address),
                        ])
                    )
                )
                setLoading(false)
            }
        }
        fetchData()
    }, [address])
    

    const header = `vybe.gg`
    
    const backgroundColor = [
        'rgba(255, 99, 132, 0.2)',   // red
        'rgba(54, 162, 235, 0.2)',   // blue
        'rgba(255, 206, 86, 0.2)',   // yellow
        'rgba(75, 192, 192, 0.2)',   // teal
        'rgba(153, 102, 255, 0.2)',  // purple
        'rgba(255, 159, 64, 0.2)',   // orange
        'rgba(255, 99, 255, 0.2)',   // magenta
        'rgba(255, 255, 99, 0.2)',   // light yellow
        'rgba(99, 255, 132, 0.2)',   // light green
        'rgba(99, 132, 255, 0.2)',   // light blue
        'rgba(255, 0, 0, 0.2)',      // bright red
        'rgba(0, 255, 0, 0.2)',      // bright green
        'rgba(0, 0, 255, 0.2)',      // bright blue
        'rgba(255, 255, 0, 0.2)',    // bright yellow
        'rgba(255, 0, 255, 0.2)',    // bright magenta
        'rgba(0, 255, 255, 0.2)',    // bright cyan
        'rgba(128, 0, 0, 0.2)',      // dark red
        'rgba(0, 128, 0, 0.2)',      // dark green
        'rgba(0, 0, 128, 0.2)',      // dark blue
        // Add more colors as needed
      ];
      

    function getLast30Days() {
        const dates = Array.from({length: 30}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        });
    
        return dates.reverse()
    }

    const chainColors : any= {
        'eth-mainnet': 'rgba(255, 99, 132, 0.2)',
        'matic-mainnet': 'rgba(54, 162, 235, 0.2)',
        'matic-mumbai': 'rgba(255, 206, 86, 0.2)',
        // Add more chains and colors as needed
      };
      
      const data = {
        labels: getLast30Days(),
        datasets: Object.keys(portfolioData).map((chainName, index) => ({
          label: `Total Networth (${chainName})`,
          data: portfolioData[chainName],
          backgroundColor: chainColors[index % backgroundColor.length],
          borderColor: chainColors[index % backgroundColor.length],
        })),
        fill: true,
      };
      

      //for displaying line chart for all data across all chains combined
    //   const data = {
    //     labels: getLast30Days(),
    //     datasets: [
    //       {
    //         label: 'Total Networth',
    //         data: Object.values(portfolioData).reduce((combinedData, chainData) => {
    //           chainData.forEach((value, index) => {
    //             combinedData[index] = (combinedData[index] || 0) + value;
    //           });
    //           return combinedData;
    //         }, []),
    //         backgroundColor: 'rgb(135, 206, 235, 1)',
    //         borderColor: 'rgba(135, 206, 235, 0.2)',
    //       },
    //     ],
    //     fill: true,
    //   };
       

    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
    };

    const combinedTokenBalances = Object.values(tokenBalances).flatMap((balances) => balances?.actualTokens ?? []);
    const combinedPercentages = Object.values(tokenBalances).flatMap((balances) => balances?.percentagesArray ?? []);
    
    let chartLabels = []
    for(let i = 0; i < tokenBalances?.actualTokens?.length; i++) {
        chartLabels.push(tokenBalances?.actualTokens[i].contract_ticker_symbol)
    }


    
    
    const chartDataset = {
        labels: combinedTokenBalances.map((token) => token.contract_ticker_symbol),
        datasets: [
          {
            label: 'Token Balances(%)',
            data: combinedPercentages,
            backgroundColor: backgroundColor.slice(0, combinedPercentages.length),
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              // Add more colors as needed
            ],
            borderWidth: 2,
          },
        ],
      };
      
    

    
    const getTxnCategory = async(txnHash: any) => {
        const txChain = (chain.id == '1' ? 'eth-mainnet' : 'matic-mainnet')
        const cat = await categorizeTransaction(txChain,txnHash)
        console.log(cat)
        return cat
    }

    const getTxnFunc = async(txnTo: any,txnHash: any) => {
        const txChain = (chain.id == '1' ? 'eth-mainnet' : 'matic-mainnet')
        const func = await getFunctionSignature(txChain,txnTo,txnHash)
        console.log(func)
        return func
    }

    useEffect(() => {
        const fetchTransactionCategories = async () => {
            const categories: Record<string, any> = {};
            const functionSignatures: Record<string, any> = {}; // Store function signatures here
    
            if (userTransactions && userTransactions.data && userTransactions.data.items) {
                const categoryPromises = userTransactions.data.items.map(async (tx: any) => {
                    const category = await getTxnCategory(tx.tx_hash);
                    categories[tx.tx_hash] = category;
    
                    // If the category is 'Contract Call', get the function signature
                    if (category === 'Contract Call') {
                        const functionSignature = await getTxnFunc(tx.to_address, tx.tx_hash);
                        functionSignatures[tx.tx_hash] = functionSignature;
                    }
                });
    
                await Promise.all(categoryPromises); // Wait for all categories to be fetched
            }
    
            setTransactionCategories(categories);
            setTxnFunction(functionSignatures); // You will have to define this state variable
            setLoading(false); // Switch off loading state
        };
        fetchTransactionCategories();
    }, [userTransactions, chain]);

    const getTotalNetWorth = () => {
        let totalNetWorth = 0;
        Object.values(portfolioData).forEach((data: Array<number>) => {
          totalNetWorth += data.reduce((sum, value) => sum + value, 0);
        });
        return totalNetWorth.toFixed(2);
      };
      
    

    return (
            <Box h={'100vh'} w={'100vw'} overflowX={'hidden'} overflowY={'scroll'} bgColor={'#08090c'} fontFamily={'Manrope'}>
                <nav className='bg-[#08090c] text-white px-16 py-8 flex items-center justify-between space-x-8'>
                    <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
                    <div className='flex flex-row space-x-8'>
                    <ConnectButton />
                    <Button
                        bgColor={'pink.800'}
                        color={'whiteAlpha.700'}
                        _hover={{
                            bgColor: 'pink.600',
                            color: 'whiteAlpha.800',
                            }}
                    >
                    get degen score
                    </Button>
                    </div>
                </nav>
                <Stack px={16} fontFamily={'Manrope'}>
                    <Text>{userAddress}</Text>
                    <HStack display={'flex'} alignItems={'center'} justify={'space-between'}>
                        <VStack h={'35%'} w={'35%'}>
                            <Heading fontFamily={'Jura'} color={'whiteAlpha.900'}>
                                Net Worth: ${getTotalNetWorth()}
                            </Heading>
                            <Pie data={chartDataset} />
                        </VStack>

                        <Stack spacing={8} h={'70vh'} w={'50%'}>
                            <Heading fontFamily={'Jura'} color={'whiteAlpha.900'} textAlign={'center'}>
                                Pixel Treasury 
                            </Heading>
                            <TableContainer style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                <Table variant={'striped'} color={'#F8F8FF'} colorScheme='blackAlpha'>
                                    <TableCaption>NFT Index</TableCaption>
                                    <Thead>
                                        <Tr style={{position: 'sticky', top: '0', background: '#F8F8FF'}}>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Name</Th>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Contract</Th>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Balance</Th>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Last Activity</Th>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Chain Name</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {Object.keys(nftBalances).flatMap((chainName) =>
                                            nftBalances[chainName]?.data.items.map((nft: any, index: number) => (
                                            <Tr key={index}>
                                                <Td>{nft.contract_name}</Td>
                                                <Td>{nft.contract_address.slice(0, 5)}...{nft.contract_address.slice(-5)}</Td>
                                                <Td>{nft.balance}</Td>
                                                <Td>{new Date(nft.last_transfered_at).toLocaleDateString()}</Td>
                                                <Td>{chainName}</Td>
                                            </Tr>
                                        )))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Stack>


                    </HStack>
                    <HStack display={'flex'} alignItems={'center'} justify={'space-between'}>
                        <Stack h={'45%'} w={'45%'}>
                            <Line data={data} options={options} />
                        </Stack>
                        <VStack align={'start'}>
                            <Stack>
                                <Heading>Satoshi's Scroll</Heading>
                                <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <Table variant={'simple'} border={'#21FC0D'} color={'#F8F8FF'}>
                                        <TableCaption>Transaction History</TableCaption>
                                        <Thead>
                                            <Tr style={{position: 'sticky', top: '0', background: '#F8F8FF'}}>
                                                <Th>From</Th>
                                                <Th>To</Th>
                                                <Th>Hash</Th>
                                                <Th>Function Executed</Th>
                                                <Th>Chain Name</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {Object.keys(userTransactions).flatMap((chainName) =>
                                            userTransactions[chainName]?.data.items.map((tx: any, index: number) => (
                                            <Tr key={index}>
                                                <Td>{tx.from_address?.slice(0, 5)}...{tx.from_address?.slice(-5)}</Td>
                                                <Td>{tx.to_address?.slice(0, 5)}...{tx.to_address?.slice(-5)}</Td>
                                                <Td>{tx.tx_hash?.slice(0, 5)}...{tx.tx_hash?.slice(-5)}</Td>
                                                {!tx.log_events?.[0]?.decoded?.name ? (
                                                    loading ? (
                                                    <Text>Loading...</Text>
                                                    ) : (
                                                    <Td>{transactionCategories[tx.tx_hash]}</Td>
                                                    )
                                                ) : (
                                                    <Td>{tx.log_events?.[0]?.decoded?.name}</Td>
                                                )}
                                                    <Td>{chainName}</Td>
                                            </Tr>
                                            ))
                                            )}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </VStack>
                    </HStack>
                </Stack>
            </Box>
        );  
}

export default WalletInfo