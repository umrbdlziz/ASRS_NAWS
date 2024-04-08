import { Card, CardHeader, CardContent } from '@mui/material';
export const TasksCard = () => {
  return (
    <Card
      sx={{
        height: '90vh',
        borderRadius: 3,
      }}
    >
      <CardHeader title='Tasks' sx={{ backgroundColor: 'grey' }} />
      <CardContent></CardContent>
    </Card>
  );
};
