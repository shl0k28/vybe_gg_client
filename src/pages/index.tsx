import { NextPage } from 'next'

const Home: NextPage = () => {
	const header = `vybe.gg`

	return(
		<div className='bg-[#14161f] h-screen w-screen'> 
			<nav className='bg-[#08090c] text-white px-8 py-4 flex items-center space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
            </nav>
		</div>
	)
}

export default Home