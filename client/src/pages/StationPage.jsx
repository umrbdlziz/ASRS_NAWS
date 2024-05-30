import { useState, useContext } from "react";
import { Typography, Switch, Box } from "@mui/material";
import { StationContext } from "../context";

import { Store, Retrieve } from "../components";

const StationPage = () => {
  const [isRetrieve, setIsRetrieve] = useState(true);

  const { currentStation } = useContext(StationContext);

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
          color="primary"
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
