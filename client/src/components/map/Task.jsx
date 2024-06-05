import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { ServerContext } from "../../context";

const Task = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/map/get_tasks`);
        setTasks(response.data.tasks);
      } catch (error) {
        console.log("Error fetching tasks:", error.message);
      }
    };
    fetchTask();
  }, [SERVER_URL]);

  return (
    <Box sx={{ padding: 2, overflow: "auto", maxHeight: "550px" }}>
      <Typography variant="h6" gutterBottom>
        Tasks
      </Typography>
      <Grid container spacing={2}>
        {[...tasks].reverse().map((task) => (
          <Grid item xs={12} key={task.booking.id}>
            <Card>
              <CardContent>
                <Box>
                  <Typography variant="body1" component="div">
                    Task ID: {task.booking.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Requester: {task.booking.requester}
                  </Typography>
                </Box>
                <Box>
                  <Typography color="textSecondary" variant="caption">
                    Category: {task.category}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Task;
