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

const WalletInfo: NextPage = () => {
    
    ChartJs.register(...registerables)

    const queryClient = useQueryClient()
    const router = useRouter()
    
    // const user = `0x7eb413211a9de1cd2fe8b8bb6055636c43f7d206`
    // 0x816fe884C2D2137C4F210E6a1d925583fa4A917d
    // local state
    const [portfolioData, setPortfolioData] = useState<Array<number>>([])
    const [nftBalances, setNftBalances] = useState<any>()
    const [tokenBalances, setTokenBalances] = useState<any>()
    const [userTransactions, setUserTransactions] = useState<any>()
    const [transactionCategories, setTransactionCategories] = useState<Record<string, any>>({});
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
        setPortfolioData(data)
        console.log(data)
        return data
    }

    // get nft balances
    const getNftBalances = async (chainName: string, address: string) => {
        let url = `http://localhost:8080/api/fetch/nftBalance?chainName=${chainName}&address=${address}`
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        setNftBalances(data)
        console.log(data)
        return data
    }

    // get token balances
    const getTokenBalances = async (chainName: string, address: string) => {
        let url = `http://localhost:8080/api/fetch/tokenBalance?chainName=${chainName}&address=${address}`
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        setTokenBalances(data)
        console.log(data)
        return data
    }

    // get user transaction history
    const getUserTransactions = async (chainName: string, address: string) => {
        let url = `http://localhost:8080/api/fetch/transactions?chainName=${chainName}&address=${address}`
        const res = await fetch(url, { method: 'GET' })
        const data = await res.json()
        setUserTransactions(data)
        console.log(data)
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
            const chainUsed = (chain.id == '1' ? 'eth-mainnet' : 'matic-mainnet')
            await Promise.all([
              getHistoricalPortfolio(chainUsed, address),
              getNftBalances(chainUsed, address),
              getTokenBalances(chainUsed, address),
              getUserTransactions(chainUsed, address),
            ])
            setLoading(false)
          }
        }
        fetchData()
      }, [address,chain])

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
    ]

    function getLast30Days() {
        const dates = Array.from({length: 30}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        });
    
        return dates.reverse()
    }

    const data = {
        labels: getLast30Days(),
        datasets: [
          {
            label: 'Total Networth($USD)',
            data: portfolioData,
            backgroundColor: 'rgb(135, 206, 235, 1)',
            borderColor: 'rgba(135, 206, 235, 0.2)',
          },
        ],
        fill: true
    };

    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
    };
    
    let chartLabels = []
    for(let i = 0; i < tokenBalances?.actualTokens.length; i++) {
        chartLabels.push(tokenBalances?.actualTokens[i].contract_ticker_symbol)
    }

    const chartData = {
        labels: chartLabels,
        datasets: [{
          label: 'Token Balances(%)',
          data: tokenBalances?.percentagesArray,
          backgroundColor: backgroundColor,
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // Add more colors if you have more cryptocurrencies.
          ],
          borderWidth: 2,
        }],
    };

    const getTxnCategory = async(txnHash: any) => {
        const cat = await categorizeTransaction("matic-mainnet",txnHash)
        console.log(cat)
        return cat
    }

    useEffect(() => {
        const fetchTransactionCategories = async () => {
            const categories: Record<string, any> = {};
            if (userTransactions && userTransactions.data && userTransactions.data.items) {
                const categoryPromises = userTransactions.data.items.map((tx: any) => 
                  getTxnCategory(tx.tx_hash).then((category) => { categories[tx.tx_hash] = category; }));

                await Promise.all(categoryPromises); // Wait for all categories to be fetched
            }
            setTransactionCategories(categories);
            setLoading(false); // Switch off loading state
        };

        fetchTransactionCategories();
    }, [userTransactions,chain]);

    return(
        <Box h={'100vh'} w={'100vw'} overflowX={'hidden'} overflowY={'scroll'} bgColor={'#08090c'} fontFamily={'Manrope'}>
            <nav className='bg-[#08090c] text-white px-16 py-8 flex items-center justify-between space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
                <div className='flex flex-row space-x-8'>
                    <ConnectButton/>
                    <Button bgColor={'pink.800'} color={'whiteAlpha.700'} _hover={{
                        bgColor: 'pink.600',
                        color: 'whiteAlpha.800'
                    }}>
                        get degen score
                    </Button>
                </div>
            </nav>
            <Stack px={16} fontFamily={'Manrope'}>
                <Text>{userAddress}</Text>
                <HStack display={'flex'} alignItems={'center'} justify={'space-between'}>
                    {/* Display Total Networth Here */}
                    {
                        tokenBalances && portfolioData && 
                        <VStack h={'35%'} w={'35%'}>
                            <Heading fontFamily={'Jura'} color={'whiteAlpha.900'}>Net Worth: ${portfolioData[0]?.toFixed(2)}</Heading>
                            <Pie data={chartData} />
                        </VStack>
                    }
                    {
                        nftBalances && 
                        <Stack spacing={8} h={'70vh'} overflowY={'scroll'} overflowX={'scroll'} w={'50%'}>
                            <Heading fontFamily={'Jura'} color={'whiteAlpha.900'} textAlign={'center'}>Pixel Treasury</Heading>
                            <TableContainer overflow={'hidden'}>
                                <Table variant={'striped'} color={'#F8F8FF'} colorScheme='blackAlpha'>
                                    <TableCaption>NFT Index</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Name</Th>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Contract</Th>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Balance</Th>
                                            <Th fontFamily={'mono'} letterSpacing={'widest'}>Last Activity</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            nftBalances && nftBalances.data.items.map((nft: any, index: number) => {
                                                return (
                                                    <Tr key={index}>
                                                        <Td>{nft.contract_name}</Td>
                                                        <Td>{nft.contract_address.slice(0,5)}...{nft.contract_address.slice(-5)}</Td>
                                                        <Td>{nft.balance}</Td>
                                                        <Td>{new Date(nft.last_transfered_at).toLocaleDateString()}</Td>
                                                    </Tr>
                                                )
                                            })
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    }
                </HStack>
            </Stack>
            <Stack px={16} py={16}>
                    {/* Transaction History Goes Here */}
                    {
                        portfolioData && <HStack h={'55%'} w={'55%'}>
                            <Line data={data} options={options}/>
                        </HStack>
                    }
            </Stack>
            
            <Stack px={16} fontFamily={'Manrope'} py={16}>
                <VStack align={'start'}>
                {
                    userTransactions && (
                        <Stack>
                            <Heading>Satoshi's Scroll</Heading>
                            <TableContainer>
                                <Table variant={'simple'} border={'#21FC0D'} color={'#F8F8FF'}>
                                    <TableCaption>Transaction History</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>From</Th>
                                            <Th>To</Th>
                                            <Th>Hash</Th>
                                            <Th>Category</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {userTransactions.data.items.map((tx: any, index: number) => (
                                            <Tr key={index}>
                                                <Td>{tx.from_address.slice(0, 5)}...{tx.from_address.slice(-5)}</Td>
                                                <Td>{tx.to_address.slice(0, 5)}...{tx.to_address.slice(-5)}</Td>
                                                <Td>{tx.tx_hash.slice(0, 5)}...{tx.tx_hash.slice(-5)}</Td>
                                                <Td>
                                                    {loading ? (
                                                        <Text>Loading...</Text>
                                                    ) : (
                                                        transactionCategories[tx.tx_hash]
                                                    )}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    )
                }
                </VStack>
            </Stack>
        </Box>
    )
}

export default WalletInfo