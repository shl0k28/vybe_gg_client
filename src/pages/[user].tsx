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
        <div>
            <nav>
                <h1>{header}</h1>
                <p>{user}</p>
            </nav>
        </div>
    )

}

export default WalletInfo