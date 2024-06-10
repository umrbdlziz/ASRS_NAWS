import { useEffect, useContext, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SparkLineChart } from "@mui/x-charts";
import axios from "axios";

import { ServerContext } from "../../context";

const UserPerformance = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const [userPerformance, setUserPerformance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/home/user_performance`);
        setUserPerformance(response.data);
      } catch (error) {
        console.log("Error retrieving user performance data:", error);
      }
    };
    fetchData();
  }, [SERVER_URL]);

  // Prepare rows and columns for DataGrid
  const rows = userPerformance.map((user, index) => {
    return {
      id: index,
      username: user.username,
      totalStockInOut: user.dailyData.reduce(
        (sum, day) => sum + day.total_stored + day.total_retrieved,
        0
      ),
      store: user.dailyData.map((data) => data.total_stored),
      retrieve: user.dailyData.map((data) => data.total_retrieved),
    };
  });

  const columns = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "totalStockInOut", headerName: "Total Stock In & Out", flex: 1 },
    {
      field: "store",
      headerName: "Store",
      flex: 1,
      renderCell: (params) => (
        <SparkLineChart
          data={params.value}
          height={50}
          width={100}
          showTooltip
          showHighlight
        />
      ),
    },
    {
      field: "retrieve",
      headerName: "Retrieve",
      flex: 1,
      renderCell: (params) => (
        <SparkLineChart
          data={params.value}
          height={50}
          width={100}
          showTooltip
          showHighlight
        />
      ),
    },
  ];

  return (
    <Paper style={{ padding: "16px", height: 470 }}>
      <Typography variant="h6" gutterBottom>
        User Performance
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </Paper>
  );
};

export default UserPerformance;
