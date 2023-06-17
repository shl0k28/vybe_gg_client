import { NextPage } from 'next'
import { Box, Button, Stack, HStack, VStack, Text, Input, Image } from '@chakra-ui/react'
import { useState } from 'react'

const Home: NextPage = () => {

	const header = `vybe.gg`
	const [address, setAddress] = useState('0x0')

	const features = [
		{
			title: `KYG - Know Your Gamers`,
			subTitle: `: Understanding at Light Speed`,
			content: `Stop guessing and start knowing. With our KYG protocol, we're shifting from averages to individuals, from hunches to certainties. Powered by blockchain technology, we offer a hyperloop ride into the unique world of each gamer, enabling you to craft experiences that resonate at a cosmic level.`,
			color: `#08090c`
		},
		{
			title: `Seamless Bridging`,
			subTitle: ` Plug into the Matrix`,
			content: `Connect the dots between the conventional and the revolutionary. Our easy-to-implement API allows Web2 games to leverage the power of blockchain, seamlessly integrating the future of tech with the platforms of today. Welcome to the symbiosis of Web2 and Web3`,
			color: ``,
		},
		{
			title: `E-Lens`,
			subTitle: `Your Money-Lens into the Metaverse`,
			content: `Journey through your gamers' financial universe like never before. Our cutting-edge AI navigates the nebula of transactions, offering you a detailed and insightful celestial map. It's time to launch into a new dimension of understanding your gamers' financial dynamics`,
			color: ``
		}
	]

	return(
		<Box h={'100vh'} w={'100vw'} overflowX={'hidden'} overflowY={'scroll'} bgColor={'#08090c'} fontFamily={'Manrope'}>
			<nav className='bg-[#08090c] text-gray-300 px-16 py-8 flex items-center justify-between space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
                <Button
					sx={{
						bg: 'linear-gradient(90deg, #fa81bb, #fcf9a8, #febe48)',
						color: 'black',
						borderRadius: '25px',
						_hover: {
						  bg: 'linear-gradient(90deg, #fa81bb, #fcf9a8, #febe48)',
						},
					  }}
				>
                    launch
                </Button>
            </nav>
			<VStack px={16} py={8} spacing={4}>
				<Text fontFamily={'Jura'} fontSize={'3xl'} color={'gray.100'} fontWeight={'bold'}>
					{`Ride the Vybe: Welcome to the Future of Gaming Insights`}
				</Text>
				<Text fontSize={'md'} color={'gray.300'}>
					{`Dive into the minds of your gamers with Vybe.gg - your interstellar tool for player understanding in the gaming cosmos.`}
				</Text>
				{/* <HStack w={'full'} justify={'center'}>
					<Input w={'container.sm'} value={address} onChange={({ target }) => setAddress(target.value)}/>
					<Button as='a' href={`/${address}`} bgColor={'pink.800'} color={'whiteAlpha.700'} _hover={{
						bgColor: 'pink.600',
						color: 'whiteAlpha.800'
					}}>
						Get KYG
					</Button>
				</HStack> */}
			</VStack>
			<HStack px={16} justify={'space-evenly'}>
				<Image src='/gaming_arcade.jpg' h={'sm'} rounded={'lg'}/>
				<Image src='/gaming_2.jpg' h={'sm'} rounded={'lg'}/>
				<Image src='/gaming_3.jpg' h={'sm'} rounded={'lg'}/>
				<Image src='/gaming_4.jpg' h={'sm'} rounded={'lg'}/>
			</HStack>
			{/* <HStack align={'center'} justify={'space-between'} px={16} py={8}>
				{
					features.map(({ title, subTitle, content }, index) => {
						return(
							<VStack key={index}>
								<Text color={'gray.100'}>{title}</Text>
								<Text color={'gray.300'}>{subTitle}</Text>
								<Text color={'gray.500'}>{content}</Text>
							</VStack>
						)
					})
				}
			</HStack> */}
		</Box>
	)
}

export default Home