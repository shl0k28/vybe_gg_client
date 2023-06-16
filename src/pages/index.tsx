import { NextPage } from 'next'
import { Box, Button, Stack, HStack, VStack, Text } from '@chakra-ui/react'

const Home: NextPage = () => {
	const header = `vybe.gg`

	return(
		<Box h={'100vh'} w={'100vw'} overflowX={'hidden'} overflowY={'scroll'} bgColor={'#08090c'} fontFamily={'Manrope'}>
			<nav className='bg-[#08090c] text-gray-300 px-16 py-8 flex items-center justify-between space-x-8'>
                <h1 className='text-3xl' style={{ fontFamily: 'Jura' }}>{header}</h1>
                <Button bgColor={'pink.800'} color={'whiteAlpha.700'} _hover={{
                    bgColor: 'pink.600',
                    color: 'whiteAlpha.800'
                }}>
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
			</VStack>
		</Box>
	)
}

export default Home