import {
	Box,
	HStack,
	Heading,
	Icon,
	Image,
	Link,
	Text,
	VStack,
	useBreakpointValue,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import GitHubButton from "react-github-btn";
import { FaArrowRight } from "react-icons/fa6";
import BlahajMap from "../components/blahaj-map";
import MapSettings from "../components/map-settings";
import blahajImage from "../images/full-flipped.png";
import transHeart from "../images/trans-heart.png";
import { BlahajData, getBlahajData } from "../lib/get-blahaj";

export const getServerSideProps = (async context => {
	return { props: { blahajData: await getBlahajData() } };
}) satisfies GetServerSideProps<{ blahajData: BlahajData }>;

export default function Home(props: { blahajData: BlahajData }) {
	const breakpoint = useBreakpointValue([0, 1, 2, 3]);

	const Logo = (
		<>
			<Image
				src={blahajImage.src}
				w={"195px"}
				mt={"-32px"}
				ml={"-96px"}
			></Image>
			<VStack spacing={0}>
				<Heading fontSize={24} lineHeight={1.2}>
					Blåhaj Quest
				</Heading>
				<Link href="https://blahaj.quest">https://blahaj.quest</Link>
			</VStack>
		</>
	);

	const Stats = (
		<VStack spacing={0} ml={4} alignItems={"start"}>
			<HStack spacing={4}>
				<Text>
					<b>
						{props.blahajData.data.length.toLocaleString("en-US")}{" "}
						stores
					</b>{" "}
				</Text>
				<Text>
					<b>
						{props.blahajData.data
							.reduce((a, b) => a + b.quantity, 0)
							.toLocaleString("en-US")}{" "}
						blåhaj
					</b>{" "}
				</Text>
			</HStack>
			<Text color={"whiteAlpha.700"} mt={-1}>
				Last updated:{" "}
				<b>
					{new Date(props.blahajData.updated).toLocaleString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</b>
			</Text>
		</VStack>
	);

	const Credits = (
		<>
			<VStack spacing={0}>
				<Text>
					Made by <b>Maki</b>
				</Text>
				<HStack spacing={1.5} mt={-1}>
					<Text>with lots of</Text>
					<Image src={transHeart.src} h={6} />
				</HStack>
			</VStack>
			<VStack ml={1} mr={4} spacing={0}>
				<Box mt={1}>
					<GitHubButton
						href="https://github.com/makidrone/blahaj-quest"
						data-size="large"
						data-show-count="true"
						aria-label="Star makidrone/blahaj-quest on GitHub"
					>
						Star
					</GitHubButton>
				</Box>
				<Link
					href="https://github.com/makidrone/blahaj-quest"
					mt={-1.5}
					display={"flex"}
					flexDir={"row"}
					alignItems={"center"}
					justifyContent={"center"}
					fontWeight={500}
				>
					See more
					<Icon as={FaArrowRight} ml={1} />
				</Link>
			</VStack>
		</>
	);

	let InnerHeader = <></>;

	if (breakpoint > 2) {
		// wide
		InnerHeader = (
			<HStack h={"64px"} w={"100vw"} spacing={4} zIndex={999}>
				{Logo}
				{Stats}
				<Box flexGrow={1}></Box>
				{Credits}
			</HStack>
		);
	} else {
		// compact
		InnerHeader = (
			<>
				<HStack h={"64px"} w={"100vw"} spacing={4} zIndex={999}>
					{Logo}
					<Box flexGrow={1}></Box>
					{Credits}
				</HStack>
				<HStack
					h={"64px"}
					w={"100vw"}
					spacing={4}
					zIndex={999}
					justifyContent={"center"}
					background={"rgba(255,255,255,0.1)"}
				>
					{Stats}
				</HStack>
			</>
		);
	}

	return (
		<VStack flexDir={"column"} w={"100vw"} h={"100vh"} spacing={0}>
			<VStack spacing={0} bg={"#3C8EA7"} boxShadow={"lg"} zIndex={100}>
				{InnerHeader}
				<Box
					bg={"rgba(0,0,0,0.2)"}
					w={"100%"}
					h={"8px"}
					pos={"relative"}
				>
					<Box
						pos={"absolute"}
						top={"16px"}
						left={"8px"}
						zIndex={2000}
					>
						<MapSettings />
					</Box>
				</Box>
			</VStack>
			<BlahajMap
				blahajData={props.blahajData}
				boxProps={{ w: "100vw", flexGrow: 1 }}
			/>
		</VStack>
	);
}
