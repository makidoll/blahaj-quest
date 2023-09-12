import {
	Box,
	Checkbox,
	HStack,
	Radio,
	RadioGroup,
	Text,
	VStack,
} from "@chakra-ui/react";
import { MapStyle, useMapSettings } from "../stores/map-settings";

export default function MapSettings() {
	const settings = useMapSettings();

	return (
		<>
			<Box
				bg={"white"}
				p={"0px 12px"}
				boxShadow={"lg"}
				borderRadius={12}
				color={"black"}
				alignItems={"start"}
				mb={2}
			>
				<RadioGroup
					value={settings.style}
					onChange={e => settings.setStyle(e as MapStyle)}
				>
					<HStack spacing={3}>
						<Radio value={MapStyle.OpenStreetMap}>
							<Text fontSize={14}>OpenStreetMap</Text>
						</Radio>
						<Box borderX={"solid 1px rgba(0,0,0,0.1)"} h="32px" />
						<Radio value={MapStyle.StamenWatercolor}>
							<Text fontSize={14}>Stamen Watercolor</Text>
						</Radio>
					</HStack>
				</RadioGroup>
			</Box>
			<VStack
				display={"inline-flex"}
				bg={"white"}
				p={"6px 12px"}
				boxShadow={"lg"}
				borderRadius={12}
				color={"black"}
				alignItems={"start"}
				spacing={0}
			>
				<Checkbox
					defaultChecked={settings.blahajLayer}
					isChecked={settings.blahajLayer}
					onChange={e => settings.setBlahajLayer(e.target.checked)}
				>
					<Text fontSize={14}>Blåhaj</Text>
				</Checkbox>
				<Checkbox
					defaultChecked={settings.heatmapLayer}
					isChecked={settings.heatmapLayer}
					onChange={e => settings.setHeatmapLayer(e.target.checked)}
				>
					<Text fontSize={14}>Heatmap</Text>
				</Checkbox>
			</VStack>
		</>
	);
}
