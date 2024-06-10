import { useEffect, useContext, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { ServerContext } from "../../context";
import {
  format,
  parseISO,
  setDate,
  setMonth,
  startOfMonth,
  endOfMonth,
  getWeek,
  differenceInCalendarWeeks,
} from "date-fns";

const RetrieveMonthly = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const [retrieve, setRetrieve] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // default to current month

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/home/retrieve`);
        setRetrieve(response.data);
        filterDataByMonth(response.data, selectedMonth);
      } catch (error) {
        console.log("Error retrieving monthly data:", error);
      }
    };
    fetchData();
  }, [SERVER_URL]);

  const filterDataByMonth = (data, month) => {
    const filtered = data.filter((item) => {
      const date = parseISO(item.datetime_retrieve);
      return date.getMonth() + 1 === month;
    });
    aggregateData(filtered, month);
  };

  const aggregateData = (data, month) => {
    const date = new Date();
    const firstDayOfMonth = setDate(setMonth(date, month - 1), 1);
    const startMonth = startOfMonth(firstDayOfMonth);
    const endMonth = endOfMonth(firstDayOfMonth);
    const firstWeek = getWeek(startMonth);

    // use differenceInCalendarWeeks bcs in Dec first week is 49 and last week is 1 (first week next year)
    const weekData = Array(differenceInCalendarWeeks(endMonth, startMonth) + 1)
      .fill(0)
      .map(() => Array(7).fill(0));

    data.forEach((item) => {
      const date = parseISO(item.datetime_retrieve);
      const week = getWeek(date) - firstWeek;

      const day = date.getDay(); // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      weekData[week][day] += item.item_quantity;
    });

    setFilteredData(weekData);
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    filterDataByMonth(retrieve, month);
  };

  return (
    <Paper>
      <Box p={2} display="flex" alignItems="center" flexDirection="column">
        <Box display="flex" flexDirection="row" gap={3} alignItems="center">
          <Typography variant="h6" style={{ marginBottom: 16 }}>
            Monthly Retrieve Data
          </Typography>
          <FormControl variant="outlined" style={{ marginBottom: 16 }}>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Month"
              size="small"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {format(new Date(2020, index, 1), "MMMM")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {filteredData.length !== 0 ? (
          <LineChart
            margin={{ top: 80, bottom: 80, left: 80, right: 80 }}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "top", horizontal: "middle" },
                padding: 0,
              },
            }}
            xAxis={[{ scaleType: "point", data: daysOfWeek }]}
            series={filteredData.map((data, index) => ({
              curve: "linear",
              data: data,
              label: `Week ${index + 1}`,
            }))}
            width={600}
            height={300}
          />
        ) : (
          <div>Loading...</div>
        )}
      </Box>
    </Paper>
  );
};

export default RetrieveMonthly;
