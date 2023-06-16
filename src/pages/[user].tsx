import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Bar, Chart } from 'react-chartjs-2'
import { Chart as ChartJs, registerables } from 'chart.js'

const WalletInfo: NextPage = () => {
    
    ChartJs.register(...registerables)

    const queryClient = useQueryClient()
    const router = useRouter()
    const { user } = router.query
    
    // local state
    const [portfolioData, setPortfolioData] = useState<Array<number>>([])
    const [nftBalances, setNftBalances] = useState<any>()
    const [tokenBalances, setTokenBalances] = useState<any>()

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

    const historicalPortfolioQuery = useQuery({ queryKey: ['history'], 
        queryFn: () => getHistoricalPortfolio('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0')
    })

    const nftBalancesQuery = useQuery({ queryKey: ['nftBalances'],
        queryFn: () => getNftBalances('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0') 
    })

    const tokenBalanceQuery = useQuery({ queryKey: ['tokenBalances'],
        queryFn: () => getTokenBalances('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0')    
    })

    const header = `vybe.gg`

    const data = {
        labels: ['Item 1', 'Item 2', 'Item 3'],
        datasets: [
          {
            label: 'Dataset',
            data: [10000, 10234, 10500],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
    };

    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
    };

    return(
        <div className='bg-[#14161f] h-screen w-screen'>
            <nav className='bg-[#08090c] text-white px-8 py-4 flex items-center space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
            </nav>
            <section>
                <div>
                    <p>{user}</p>
                </div>
                {/* <button onClick={() => getPortfolio('eth-mainnet', '0xCF1C64Ac9075D0a41Bb3e7D5A08E8CCAc512b1d0')}>Get Portfolio</button> */}
            </section>
            <section>
                {
                    historicalPortfolioQuery.data && <div>
                        <Bar data={data} options={options}/>
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
                    tokenBalanceQuery.data && <div></div>
                }
            </section>
        </div>
    )
}

export default WalletInfo