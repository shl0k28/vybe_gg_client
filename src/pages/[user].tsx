import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJs, registerables } from 'chart.js'
import { Button, Box, HStack, VStack, Stack, Heading, Text, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react'

const WalletInfo: NextPage = () => {
    
    ChartJs.register(...registerables)

    const queryClient = useQueryClient()
    const router = useRouter()
    const { user } = router.query
    
    // local state
    const [portfolioData, setPortfolioData] = useState<Array<number>>([])
    const [nftBalances, setNftBalances] = useState<any>()
    const [tokenBalances, setTokenBalances] = useState<any>()
    const [userTransactions, setUserTransactions] = useState<any>()

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

    const historicalPortfolioQuery = useQuery({ queryKey: ['history'], 
        queryFn: () => getHistoricalPortfolio('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0')
    })

    const nftBalancesQuery = useQuery({ queryKey: ['nftBalances'],
        queryFn: () => getNftBalances('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0') 
    })

    const tokenBalanceQuery = useQuery({ queryKey: ['tokenBalances'],
        queryFn: () => getTokenBalances('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0')    
    })

    const userTransactionsQuery = useQuery({ queryKey: ['userTransactions'],
        queryFn: () => getUserTransactions('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0')
    })

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
    
    const chartData = {
        labels: ['USD', "ETH"],
        datasets: [{
          label: 'Token Balances(%)',
          data: tokenBalances?.percentagesArray,
          backgroundColor: backgroundColor,
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // Add more colors if you have more cryptocurrencies.
          ],
          borderWidth: 1,
        }],
    };
    

    return(
        <Box h={'100vh'} w={'100vw'} overflowX={'hidden'} overflowY={'scroll'} bgColor={'#08090c'} fontFamily={'Manrope'}>
            <nav className='bg-[#08090c] text-white px-16 py-8 flex items-center justify-between space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
                <Button bgColor={'pink.800'} color={'whiteAlpha.700'} _hover={{
                    bgColor: 'pink.600',
                    color: 'whiteAlpha.800'
                }}>
                    get degen score
                </Button>
            </nav>
            <Stack px={16} fontFamily={'Manrope'}>
                <Text>{user}</Text>
                <HStack display={'flex'} alignItems={'center'} justify={'space-between'}>
                    {/* Display Total Networth Here */}
                    {
                        tokenBalances && <Stack h={'80%'} w={'33%'}>
                            <Pie data={chartData}/>
                        </Stack>
                    }
                    {
                        nftBalances && 
                        <Stack w={'container.sm'}>
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
                                                    <Tr>
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
            <Stack>
                <HStack>
                    {/* Transaction History Goes Here */}
                    
                </HStack>
                <HStack>
                    {/* Historical Portfolio Value Goes Here */}
                </HStack>
            </Stack>
            <section className='px-8 py-4 flex items-center'>
                {
                    historicalPortfolioQuery.data && <div className='w-2/5'>
                        <Line data={data} options={options}/>
                    </div>
                }
            </section>
            <section>
                {
                    nftBalancesQuery.data && <div>

                    </div>
                }
            </section>
            <section>
                {
                    userTransactionsQuery.data && <div>
                        
                    </div>
                }
            </section>
        </Box>
    )
}

export default WalletInfo