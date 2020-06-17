import { EventData, Style } from 'mapbox-gl';
import { Map } from 'mapbox-gl';
import React, { Fragment } from 'react';
import ReactMapboxGl, { ZoomControl } from 'react-mapbox-gl';
import { FitBounds } from 'react-mapbox-gl/lib/map';
import Loading from '../../components/page/Loading';
import { GISIDA_MAPBOX_TOKEN } from '../../configs/env';
import { imgArr } from '../../configs/settings';
import { gsLiteStyle } from './helpers';

/** single map icon description */
interface MapIcon {
  id: string;
  imageUrl: string;
}

/** interface for  GisidaLite props */
interface GisidaLiteProps {
  accessToken: string;
  attributionControl: boolean;
  customAttribution: string;
  injectCSS: boolean;
  layers: JSX.Element[];
  mapCenter: [number, number] | undefined;
  mapBounds?: FitBounds;
  mapHeight: string;
  mapStyle: Style | string;
  mapWidth: string;
  scrollZoom: boolean;
  zoom: number;
  mapIcons: MapIcon[];
  onClickHandler?: (map: Map, event: EventData) => void;
}

/** Default props for GisidaLite */
const gisidaLiteDefaultProps: GisidaLiteProps = {
  accessToken: GISIDA_MAPBOX_TOKEN,
  attributionControl: true,
  customAttribution: '&copy; Reveal',
  injectCSS: true,
  layers: [],
  mapCenter: undefined,
  mapHeight: '800px',
  mapIcons: imgArr,
  mapStyle: gsLiteStyle,
  mapWidth: '100%',
  scrollZoom: true,
  zoom: 17,
};

/**
 * Really simple Gisida :)
 *
 * Inspired by the Map component in Akuko
 *
 * TODO: Add support for handlers and popups
 * TODO: Fix map jankiness
 */
const GisidaLite = (props: GisidaLiteProps) => {
  const [renderLayers, setRenderLayers] = React.useState<boolean>(false);
  const {
    accessToken,
    attributionControl,
    customAttribution,
    injectCSS,
    layers,
    mapCenter,
    mapHeight,
    mapWidth,
    mapStyle,
    mapIcons,
    onClickHandler,
    zoom,
    mapBounds,
  } = props;

  if (mapCenter === undefined) {
    return <Loading />;
  }

  const Mapbox = ReactMapboxGl({
    accessToken,
    attributionControl,
    customAttribution,
    injectCSS,
  });

  const runAfterMapLoaded = (map: Map) => {
    if (mapIcons) {
      mapIcons.forEach(element => {
        map.loadImage(
          element.imageUrl,
          (
            _: Error,
            res:
              | HTMLImageElement
              | ArrayBufferView
              | { width: number; height: number; data: Uint8Array | Uint8ClampedArray }
              | ImageData
          ) => {
            map.addImage(element.id, res);
            if (!renderLayers) {
              setRenderLayers(true);
            }
          }
        );
      });
    }
  };

  return (
    <Mapbox
      center={mapCenter}
      zoom={[zoom]}
      style={mapStyle}
      containerStyle={{
        height: mapHeight,
        width: mapWidth,
      }}
      fitBounds={mapBounds}
      onStyleLoad={runAfterMapLoaded}
      onClick={onClickHandler}
    >
      <>
        {renderLayers &&
          layers.map((item: any, index: number) => (
            <Fragment key={`gsLite-${index}`}>{item}</Fragment>
          ))}
        <ZoomControl />
      </>
    </Mapbox>
  );
};

GisidaLite.defaultProps = gisidaLiteDefaultProps;

export { GisidaLite };