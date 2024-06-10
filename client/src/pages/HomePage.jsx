import { Grid, Box, Hidden } from "@mui/material";
import {
  RetrieveMonthly,
  StoreMonthly,
  TotalItem,
  UserPerformance,
  RobotRuntime,
  RobotInfo,
} from "../components/home";

const HomePage = () => {
  return (
    <Box sx={{ margin: "10px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={4}>
          <TotalItem />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <RetrieveMonthly />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StoreMonthly />
        </Grid>
        <Hidden lgDown>
          <Grid item md={4}>
            <UserPerformance />
          </Grid>
          <Grid item md={4}>
            <RobotRuntime />
          </Grid>
          <Grid item md={4}>
            <RobotInfo />
          </Grid>
        </Hidden>
      </Grid>
    </Box>
  );
};
export default HomePage;
