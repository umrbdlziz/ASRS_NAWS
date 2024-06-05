import { useMapEvents } from "react-leaflet";
import ProtoTypes from "prop-types";

const MapEvents = ({ setIconSize }) => {
  const map = useMapEvents({
    zoomend: () => {
      const zoomLevel = map.getZoom();
      switch (zoomLevel) {
        case -3:
          setIconSize([15, 15]);
          break;
        case -2:
          setIconSize([20, 20]);
          break;
        case -1:
          setIconSize([30, 30]);
          break;
        case 0:
          setIconSize([50, 50]);
          break;
        case 1:
          setIconSize([80, 80]);
          break;

        default:
          break;
      }
    },
  });

  return null;
};

MapEvents.propTypes = {
  setIconSize: ProtoTypes.func.isRequired,
};

export default MapEvents;
