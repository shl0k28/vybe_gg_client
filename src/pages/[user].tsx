import { NextPage } from "next";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useState, useEffect, use } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJs, registerables } from "chart.js";
import { Button,Box,HStack,VStack,Stack,Heading,Text,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Select,Flex } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";
import { categorizeTransaction } from "@/components/CategorizeTxn";
import { getFunctionSignature } from "@/components/CategorizeTxn";
import { create } from "ipfs-http-client";

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const WalletInfo: NextPage = () => {
  ChartJs.register(...registerables);

  const queryClient = useQueryClient();
  const router = useRouter();

  const address = `0x7eb413211a9de1cd2fe8b8bb6055636c43f7d206`
  // 0x816fe884C2D2137C4F210E6a1d925583fa4A917d
  // local state
  const [portfolioData, setPortfolioData] = useState<
    Record<string, Array<number>>
  >({});
  const [nftBalances, setNftBalances] = useState<Record<string, any>>({});
  const [tokenBalances, setTokenBalances] = useState<Record<string, any>>({});
  const [userTransactions, setUserTransactions] = useState<Record<string, any>>(
    {}
  );
  const [transactionCategories, setTransactionCategories] = useState<
    Record<string, any>
  >({});
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const [selectedChainNFT, setSelectedChainNFT] = useState<string>("all");
  const [txnFunction, setTxnFunction] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [userAddress, setUserAddress] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  // const { address }: any = useAccount();
  const { chain }: any = useNetwork();

  useEffect(() => {
    if (address) {
      setUserAddress(address);
    }
  }, [address, chain]);

  // get portfolio data
  const getHistoricalPortfolio = async (chainName: string, address: string) => {
    let url = `http://localhost:8080/api/fetch/portfolio?chainName=${chainName}&address=${address}`;
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();
    setPortfolioData((prevData) => ({ ...prevData, [chainName]: data }));
    return data;
  };

  // get nft balances
  const getNftBalances = async (chainName: string, address: string) => {
    let url = `http://localhost:8080/api/fetch/nftBalance?chainName=${chainName}&address=${address}`;
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();
    setNftBalances((prevData) => ({ ...prevData, [chainName]: data }));
    return data;
  };

  // get token balances
  const getTokenBalances = async (chainName: string, address: string) => {
    let url = `http://localhost:8080/api/fetch/tokenBalance?chainName=${chainName}&address=${address}`;
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();
    setTokenBalances((prevData) => ({ ...prevData, [chainName]: data }));
    return data;
  };

  // get user transaction history
  const getUserTransactions = async (chainName: string, address: string) => {
    let url = `http://localhost:8080/api/fetch/transactions?chainName=${chainName}&address=${address}`;
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();
    setUserTransactions((prevData) => ({ ...prevData, [chainName]: data }));
    return data;
  };

  const storeUserDataToIpfs = async () => {
    const userData = {
      portfolioData,
      nftBalances,
      tokenBalances,
      userTransactions,
      transactionCategories,
      txnFunction,
      userAddress,
    };

    try {
      const ipfsResult = await ipfs.add(JSON.stringify(userData));
      console.log(
        `User data stored successfully on IPFS. CID: ${ipfsResult.path}`
      );
      await fetchUserDataFromIpfs(ipfsResult.path);
    } catch (error) {
      console.error("Failed to store user data to IPFS:", error);
    }
  };

  const fetchUserDataFromIpfs = async (cid: string) => {
    try {
      const stream = ipfs.cat(cid);
      let data = "";

      for await (const chunk of stream) {
        data += chunk.toString();
      }

      const userData = JSON.parse(data);
      console.log("Fetched user data from IPFS:", userData);
    } catch (error) {
      console.error("Failed to fetch user data from IPFS:", error);
    }
  };

  const chains = ["eth-mainnet", "matic-mainnet", "matic-mumbai"]; // Add more networks

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        await Promise.all(
          chains.map((chainName) =>
            Promise.all([
              getHistoricalPortfolio(chainName, address),
              getNftBalances(chainName, address),
              getTokenBalances(chainName, address),
              getUserTransactions(chainName, address),
            ])
          )
        );
        setLoading(false);
        // Call the new function to store user data to IPFS
        await storeUserDataToIpfs();
      }
    };
    fetchData();
  }, [address]);

  const handleChainSelection = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedChain(event.target.value);
  };

  const handleChainSelectionNFT = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedChainNFT(event.target.value);
  };

  const header = `vybe.gg`;

  const backgroundColor = [
    "rgba(255, 99, 132, 0.2)", // red
    "rgba(54, 162, 235, 0.2)", // blue
    "rgba(255, 206, 86, 0.2)", // yellow
    "rgba(75, 192, 192, 0.2)", // teal
    "rgba(153, 102, 255, 0.2)", // purple
    "rgba(255, 159, 64, 0.2)", // orange
    "rgba(255, 99, 255, 0.2)", // magenta
    "rgba(255, 255, 99, 0.2)", // light yellow
    "rgba(99, 255, 132, 0.2)", // light green
    "rgba(99, 132, 255, 0.2)", // light blue
    "rgba(255, 0, 0, 0.2)", // bright red
    "rgba(0, 255, 0, 0.2)", // bright green
    "rgba(0, 0, 255, 0.2)", // bright blue
    "rgba(255, 255, 0, 0.2)", // bright yellow
    "rgba(255, 0, 255, 0.2)", // bright magenta
    "rgba(0, 255, 255, 0.2)", // bright cyan
    "rgba(128, 0, 0, 0.2)", // dark red
    "rgba(0, 128, 0, 0.2)", // dark green
    "rgba(0, 0, 128, 0.2)", // dark blue
    // Add more colors as needed
  ];

  function getLast12Months() {
    const dates = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
    return dates.reverse();
  }

  const chainColors: any = {
    "eth-mainnet": "rgba(255, 99, 132, 0.2)",
    "matic-mainnet": "rgba(54, 162, 235, 0.2)",
    "matic-mumbai": "rgba(255, 206, 86, 0.2)",
    // Add more chains and colors as needed
  };

  const data = {
    labels: getLast12Months(),
    datasets: Object.keys(portfolioData).map((chainName, index) => ({
      label: `Total Networth (${chainName})`,
      data: portfolioData[chainName],
      backgroundColor: chainColors[index % backgroundColor.length],
      borderColor: chainColors[index % backgroundColor.length],
    })),
    fill: true,
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const combinedTokenBalances = Object.values(tokenBalances).flatMap(
    (balances) => balances?.actualTokens ?? []
  );
  const combinedPercentages = Object.values(tokenBalances).flatMap(
    (balances) => balances?.percentagesArray ?? []
  );

  let chartLabels = [];
  for (let i = 0; i < tokenBalances?.actualTokens?.length; i++) {
    chartLabels.push(tokenBalances?.actualTokens[i].contract_ticker_symbol);
  }

  useEffect(() => {
    // This code runs only on the client side
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chartDataset = {
    labels: combinedTokenBalances.map((token) => token.contract_ticker_symbol),
    datasets: [
      {
        label: "Token Balances(%)",
        data: combinedPercentages,
        backgroundColor: backgroundColor.slice(0, combinedPercentages.length),
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          // Add more colors as needed
        ],
        borderWidth: 2,
      },
    ],
  };

  const top5Indices = combinedPercentages.map((percentage, index) => ({ index, percentage }))
  .sort((a, b) => b.percentage - a.percentage)
  .slice(0, 5)
  .map(entry => entry.index);

// Filtered data for mobile view
const mobileLabels = top5Indices.map(index => combinedTokenBalances[index].contract_ticker_symbol);
const mobileData = top5Indices.map(index => combinedPercentages[index]);
const mobileBackgroundColor = top5Indices.map(index => backgroundColor[index]);

// Conditional dataset based on view
const displayDataset = isMobile ? {
  labels: mobileLabels,
  datasets: [
    {
      label: "Token Balances(%)",
      data: mobileData,
      backgroundColor: mobileBackgroundColor,
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        // Add more colors as needed
      ],
      borderWidth: 2,
    },
  ],
} : chartDataset;

  const getTxnCategory = async (txnHash: any) => {
    const txChain = chain.id == "1" ? "eth-mainnet" : "matic-mainnet";
    const cat = await categorizeTransaction(txChain, txnHash);
    console.log(cat);
    return cat;
  };

  const getTxnFunc = async (txnTo: any, txnHash: any) => {
    const txChain = chain.id == "1" ? "eth-mainnet" : "matic-mainnet";
    const func = await getFunctionSignature(txChain, txnTo, txnHash);
    console.log(func);
    return func;
  };

  useEffect(() => {
    const fetchTransactionCategories = async () => {
      const categories: Record<string, any> = {};
      const functionSignatures: Record<string, any> = {}; // Store function signatures here

      if (
        userTransactions &&
        userTransactions.data &&
        userTransactions.data.items
      ) {
        const categoryPromises = userTransactions.data.items.map(
          async (tx: any) => {
            const category = await getTxnCategory(tx.tx_hash);
            categories[tx.tx_hash] = category;

            // If the category is 'Contract Call', get the function signature
            if (category === "Contract Call") {
              const functionSignature = await getTxnFunc(
                tx.to_address,
                tx.tx_hash
              );
              functionSignatures[tx.tx_hash] = functionSignature;
            }
          }
        );

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

  const getOpenseaUrl = (
    chainName: any,
    contractAddress: any,
    tokenId: any
  ) => {
    let openseaChainName: string = "";
    if (chainName == "eth-mainnet" || chainName == "matic-mainnet") {
      if (chainName == "eth-mainnet") {
        openseaChainName = "ethereum";
      } else if (chainName == "matic-mainnet") {
        openseaChainName = "matic";
      }
      return `https://opensea.io/assets/${openseaChainName}/${contractAddress}/${tokenId}`;
    } else {
      openseaChainName = "mumbai";
      return `https://testnets.opensea.io/assets/${openseaChainName}/${contractAddress}/${tokenId}`;
    }
  };

  return (
    <Box
    h={"100vh"}
    w={"100vw"}
    overflowX={"hidden"}
    overflowY={"scroll"}
    bgColor={"#08090c"}
    fontFamily={"Manrope"}
  >
    <nav className="bg-[#08090c] text-white px-4 sm:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-8">
      <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: "Jura" }}>
        {header}
      </h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto items-stretch sm:items-center">
        <ConnectButton />
        <Button
          className="w-full sm:w-auto"
          bgColor={"pink.800"}
          color={"whiteAlpha.700"}
          _hover={{
            bgColor: "pink.600",
            color: "whiteAlpha.800",
          }}
        >
          get degen score
        </Button>
      </div>
    </nav>

      <Stack px={16} fontFamily={"Manrope"}>
        <Text>{userAddress}</Text>
        <Flex direction={["column", "column", "row"]} alignItems={"center"} justify={"space-between"} >
          <Box h={["30%", "30%", "35%"]} w={["100%", "100%", "35%"]} mb={8}>
            <Heading fontFamily={"Jura"} color={"whiteAlpha.900"}>
              Net Worth: ${getTotalNetWorth()}
            </Heading>
            <Pie data={displayDataset} />
          </Box>

          <Box h={"auto"} w={["100%", "100%", "45%"]}>
            <Heading fontFamily={"Jura"} color={"whiteAlpha.900"} textAlign={"center"}>
              Pixel Treasury
            </Heading>
            <Select placeholder="Select chain" color={"#F8F8FF"} value={selectedChainNFT} onChange={handleChainSelectionNFT}>
              <option value="all">All</option>
              {chains.map((chain) => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </Select>
            <Carousel showThumbs={false} dynamicHeight={false}>
              {(selectedChainNFT === "all" ? Object.keys(nftBalances) : [selectedChainNFT]
              ).flatMap((chainName) => nftBalances[chainName]?.data.items.map(
                  (nft: any, index: number) => (
                    <Box key={index} py="10" rounded="md">
                      <a href={getOpenseaUrl( chainName, nft.contract_address, nft?.nft_data[0].token_id)} target="_blank" rel="noopener noreferrer" className="block">
                        <img
                          src={ nft?.nft_data[0].external_data?.image || "https://via.placeholder.com/150" } alt={nft?.contract_name || "NFT image"}
                          className="object-contain h-[20rem] rounded-xl mb-4 "/>
                      </a>
                      <Text fontFamily="mono" fontSize="xl" mb="1" color={"#F8F8FF"}>{nft.contract_name}</Text>
                      <Text fontFamily="mono" fontSize="sm" color={"#F8F8FF"}>{chainName}</Text>
                    </Box>
                  )
                )
              )}
            </Carousel>
          </Box>
        </Flex>

        <Flex direction={["column", "column", "row"]} alignItems={"center"} justify={"space-between"}
        >
          <Box h={["50vh", "50vh", "50vh"]} w={["100%", "100%", "100%"]} overflow={"auto"}>
            <Line data={data} options={{ ...options,responsive: true,maintainAspectRatio: false, }}
            />
          </Box>
          <Box h={["45%", "45%", "45%"]} w={["100%", "100%", "85%"]} overflow={"auto"} mt={8}
          >
            <Stack>
              <Heading>Satoshis Scroll</Heading>
              <Select placeholder="Select chain" color={"#F8F8FF"} value={selectedChain} onChange={handleChainSelection}
              >
                <option value="all">All</option>
                {chains.map((chain) => (
                  <option key={chain} value={chain}>
                    {chain}
                  </option>
                ))}
              </Select>
              <TableContainer width={["90vw", "80vw", "50vw"]} style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                <Table variant={"simple"} border={"#21FC0D"} color={"#F8F8FF"}>
                  <TableCaption>Transaction History</TableCaption>
                  <Thead>
                    <Tr
                      style={{ position: "sticky", top: "0", background: "#F8F8FF",
                      }}
                    >
                      <Th>From</Th>
                      <Th>To</Th>
                      <Th>Hash</Th>
                      <Th>Function Executed</Th>
                      <Th>Chain Name</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(selectedChain === "all"
                      ? Object.keys(userTransactions)
                      : [selectedChain]
                    ).flatMap((chainName) =>
                      userTransactions[chainName]?.data.items.map(
                        (tx: any, index: number) => (
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
                        )
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </Box>
        </Flex>
      </Stack>
    </Box>
  );
};

export default WalletInfo;
