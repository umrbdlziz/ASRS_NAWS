import { Grid } from '@mui/material';
import { LiveMap, TasksCard } from '../components';

export const MapPage = () => {
  return (
    <Grid container direction='row' spacing={3} justifyContent='center'>
      <Grid item xs={8}>
        <LiveMap />
      </Grid>
      <Grid item xs={4}>
        <TasksCard />
      </Grid>
    </Grid>
  );
};
