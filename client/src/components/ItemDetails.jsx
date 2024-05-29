import { useContext, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import PropTypes from "prop-types";
import { ServerContext } from "../context";

const ItemDetails = ({ itemData, onQuantitiesChange }) => {
  const { SERVER_URL } = useContext(ServerContext);
  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    // Initialize quantities state with itemData
    const initialQuantities = itemData
      ? itemData.map((item) => ({
          item_code: item.item_code,
          quantity: item.quantity || 0,
        }))
      : [];
    setQuantities(initialQuantities);
  }, [itemData]);

  const handleIncrement = (index) => {
    const updatedQuantities = quantities.map((item, idx) =>
      idx === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setQuantities(updatedQuantities);
    onQuantitiesChange(updatedQuantities); // Call the callback with updated quantities
  };

  const handleDecrement = (index) => {
    const updatedQuantities = quantities.map((item, idx) =>
      idx === index && item.quantity > 0
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setQuantities(updatedQuantities);
    onQuantitiesChange(updatedQuantities); // Call the callback with updated quantities
  };

  return (
    <Box flex={1} marginRight={2} maxHeight={480} overflow="auto" padding={2}>
      <Typography variant="h6" gutterBottom>
        Item Details
      </Typography>
      {itemData &&
        itemData.map((item, index) => (
          <Card key={index} style={{ marginBottom: 16 }}>
            <CardMedia
              component="img"
              alt={item.item_desc}
              image={`${SERVER_URL}/uploads/${item.item_img}`}
              title={item.item_desc}
              style={{ height: 140, objectFit: "contain" }}
            />
            <CardContent>
              <Typography gutterBottom variant="subtitle1" component="div">
                {item.item_code}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.item_desc}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop={2}
              >
                <IconButton onClick={() => handleDecrement(index)}>
                  <Remove />
                </IconButton>
                <Typography variant="body1">
                  {quantities[index]?.quantity || 0}
                </Typography>
                <IconButton onClick={() => handleIncrement(index)}>
                  <Add />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
    </Box>
  );
};

ItemDetails.propTypes = {
  itemData: PropTypes.array,
  onQuantitiesChange: PropTypes.func, // Add the callback prop type
};

export default ItemDetails;
