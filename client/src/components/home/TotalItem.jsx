import { useEffect, useContext, useState } from "react";
import { ServerContext } from "../../context";
import axios from "axios";
import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import LoadingSpinner from "../utils/LoadingSpinner";

const TotalItem = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [totalItem, setTotalItem] = useState(0);
  const [store, setStore] = useState(0);
  const [retrieve, setRetrieve] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/home/total_items`);
        setTotalItem(response.data.total_items);
        setStore(response.data.store_percentage);
        setRetrieve(response.data.retrieve_percentage);
        setIsLoading(false);
      } catch (error) {
        console.log("Error retrieving total data:", error);
      }
    };
    fetchData();
  }, [SERVER_URL]);

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  let paperHeight = "auto"; // default height for small screens
  if (isMediumScreen) {
    paperHeight = 300;
  }
  if (isLargeScreen) {
    paperHeight = 390;
  }
  return (
    <Paper style={{ height: paperHeight }}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Box p={2} display="flex" alignItems="center" flexDirection="column">
          <Box display="flex" flexDirection="row" alignItems="flex-end" gap={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="subtitle2" align="center">
                Percentage Complete <br /> Storing
              </Typography>
              <Gauge
                width={150}
                height={150}
                value={parseFloat(store.toFixed(2))}
                text={({ value }) => `${value}%`}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 20,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#4CFFBE",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })}
              />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="subtitle1">
                Total Item in Warehouse
              </Typography>
              <Gauge
                width={200}
                height={200}
                value={totalItem}
                valueMax={totalItem}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 50,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#4ECBFF",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })}
              />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="subtitle2" align="center">
                Percentage Complete <br /> Order
              </Typography>
              <Gauge
                width={150}
                height={150}
                value={parseFloat(retrieve.toFixed(2))}
                text={({ value }) => `${value}%`}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 20,
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#4CFFBE",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default TotalItem;
