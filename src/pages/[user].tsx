import { NextPage } from 'next'
import { useRouter } from 'next/router'

const WalletInfo: NextPage = () => {
    
    const router = useRouter()
    const { user } = router.query
    
    const fetchUserInfo = async () => {
        const res = await fetch('http://localhost:8080/fetch/portfolio')
        const data = await res.json()
        console.log(data)
    }

    const header = `vybe.gg`

    return(
        <div className='bg-[#14161f] h-screen w-screen'>
            <nav className='bg-[#08090c] text-white px-8 py-4 flex items-center space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
            </nav>
            <section>
                <div>
                    <p>{user}</p>
                </div>
            </section>
        </div>
    )

}

export default WalletInfo