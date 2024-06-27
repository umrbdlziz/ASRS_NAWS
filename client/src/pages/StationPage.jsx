import { useState, useEffect, useContext } from "react";
import { Typography, Switch, Box } from "@mui/material";
import { StationContext } from "../context";

import { Store, Retrieve } from "../components";

const StationPage = () => {
  // Initialize state based on localStorage value or default to true
  const [isRetrieve, setIsRetrieve] = useState(() => {
    const storedIsRetrieve = localStorage.getItem("isRetrieve");
    return storedIsRetrieve !== null ? JSON.parse(storedIsRetrieve) : true;
  });

  const { currentStation } = useContext(StationContext);

  useEffect(() => {
    // Update localStorage whenever isRetrieve changes
    localStorage.setItem("isRetrieve", JSON.stringify(isRetrieve));
  }, [isRetrieve]);

  if (!currentStation) {
    console.log("Please select a station first");
  }

  const handleSwitchChange = (event) => {
    setIsRetrieve(event.target.checked);
  };

  return (
    <div style={{ margin: 10 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginBottom={2}
      >
        <Typography variant="subtitle1" marginRight={1}>
          Store
        </Typography>
        <Switch
          checked={isRetrieve}
          onChange={handleSwitchChange}
          color="info"
        />
        <Typography variant="subtitle1" marginLeft={1}>
          Retrieve
        </Typography>
      </Box>
      {isRetrieve ? <Retrieve /> : <Store />}
    </div>
  );
};

export default StationPage;
