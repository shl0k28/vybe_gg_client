import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Line, Pie } from 'react-chartjs-2'
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
          data: tokenBalances.percentagesArray,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            // Add more colors if you have more cryptocurrencies.
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // Add more colors if you have more cryptocurrencies.
          ],
          borderWidth: 1,
        }],
    };

    return(
        <div className='bg-[#14161f] h-screen w-screen overflow-hidden'>
            <nav className='bg-[#08090c] text-white px-8 py-4 flex items-center space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
            </nav>
            <section className='px-8 py-4 flex items-center'>
                {
                    historicalPortfolioQuery.data && <div className='w-2/5'>
                        <Line data={data} options={options}/>
                    </div>
                }
                {
                    tokenBalanceQuery.data && <div className='w-1/4'>
                        <Pie data={chartData}/>
                    </div>
                }
            </section>
            <section>
                {
                    nftBalancesQuery.data && <div>

                    </div>
                }
            </section>
            <section className='w-1/3 h-10'>
                
            </section>
        </div>
    )
}

export default WalletInfo