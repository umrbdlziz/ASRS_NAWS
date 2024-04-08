import 'leaflet/dist/leaflet.css';
import './styles.css';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import { ImageOverlay, MapContainer } from 'react-leaflet';

export const LiveMap = () => {
  const [bounds, setBounds] = useState([
    [0, 0],
    [0, 0],
  ]);
  const imgSrc = '/office.png';

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Set the conversion factor
      const conversionFactor = 0.01;

      // Calculate the bounds
      const bounds = [
        [0, 0],
        [img.height * conversionFactor, img.width * conversionFactor],
      ];

      setBounds(bounds);
    };
    img.src = imgSrc;
  }, []);

  return (
    <Card
      sx={{
        height: '90vh',
        borderRadius: 3,
      }}
    >
      <CardHeader title='Live Map' sx={{ backgroundColor: 'grey' }} />
      <CardContent>
        <MapContainer center={[5, 3]} zoom={6}>
          <ImageOverlay url={imgSrc} bounds={bounds} />
        </MapContainer>
      </CardContent>
    </Card>
  );
};
