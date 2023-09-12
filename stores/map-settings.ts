import { create } from "zustand";

export enum MapStyle {
	OpenStreetMap = "OpenStreetMap",
	StamenWatercolor = "StamenWatercolor",
}

interface MapSettings {
	style: MapStyle;
	blahajLayer: boolean;
	heatmapLayer: boolean;
	setStyle: (style: MapStyle) => any;
	setBlahajLayer: (blahajLayer: boolean) => any;
	setHeatmapLayer: (heatmapLayer: boolean) => any;
}

export const useMapSettings = create<MapSettings>()(
	// persist(
	set => ({
		style: MapStyle.OpenStreetMap,
		blahajLayer: true,
		heatmapLayer: false,
		setStyle: (style: MapStyle) => set({ style }),
		setBlahajLayer: (blahajLayer: boolean) => set({ blahajLayer }),
		setHeatmapLayer: (heatmapLayer: boolean) => set({ heatmapLayer }),
	}),
	// 	{
	// 		name: "blahaj-quest", // unique name
	// 		storage: createJSONStorage(() => localStorage),
	// 	},
	// ),
);

export const MapStyleConfigs: { [key in MapStyle]: any } = {
	OpenStreetMap: {
		version: 8,
		name: "OpenStreetMap Mapnik raster tiles (Default)",
		metadata: {
			"mapbox:autocomposite": true,
		},
		glyphs: "https://cdn.jsdelivr.net/gh/lukasmartinelli-alt/glfonts@gh-pages/fonts/{fontstack}/{range}.pbf",
		sources: {
			"osm-mapnik": {
				type: "raster",
				tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
				tileSize: 256,
				attribution:
					"Basemap data <a href='https://www.osm.org' target=_blank>© OpenStreetMap contributors</a>",
			},
		},
		layers: [
			{
				id: "background",
				type: "background",
				paint: {
					"background-color": "rgba(0,0,0,0)",
				},
			},
			{
				id: "osm-mapnik",
				type: "raster",
				source: "osm-mapnik",
			},
		],
		owner: "OpenStreetMap India",
	},
	StamenWatercolor: {
		version: 8,
		name: "OpenStreetMap Mapnik raster tiles (Default)",
		metadata: {
			"mapbox:autocomposite": true,
		},
		glyphs: "https://cdn.jsdelivr.net/gh/lukasmartinelli-alt/glfonts@gh-pages/fonts/{fontstack}/{range}.pbf",
		sources: {
			"osm-mapnik": {
				type: "raster",
				tiles: [
					"https://stamen-tiles-c.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
				],
				tileSize: 256,
				attribution:
					"<a href='http://maps.stamen.com' target=_blank>© Stamen Maps</a> <a href='https://www.osm.org' target=_blank>© OpenStreetMap contributors</a>",
			},
		},
		layers: [
			{
				id: "background",
				type: "background",
				paint: {
					"background-color": "rgba(0,0,0,0)",
				},
			},
			{
				id: "osm-mapnik",
				type: "raster",
				source: "osm-mapnik",
			},
		],
		owner: "OpenStreetMap India",
	},
};
