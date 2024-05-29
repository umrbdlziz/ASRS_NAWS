import PropTypes from "prop-types";
import { Box, Grid } from "@mui/material";

const Layout = ({ data, currSide, greenPigeonhole }) => {
  let layout = {};
  for (let sides in data) {
    if (sides === currSide) {
      layout = data[sides];
    }
  }
  const renderLevel = (level, row, col) => {
    const cells = [];
    for (let r = row - 1; r >= 0; r--) {
      for (let c = 0; c < col; c++) {
        const position = `R1-S1-${level}-${r + 1}-${c + 1}`;
        const isGreen = greenPigeonhole.includes(position);
        cells.push(
          <Grid item xs={12 / col} key={`row-${r}-col-${c}`}>
            <Box
              sx={{
                border: "0.5px solid black",
                background: isGreen ? "green" : "red",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              {`${r + 1}-${c + 1}`}
            </Box>
          </Grid>
        );
      }
    }
    return cells;
  };

  const renderLevels = () => {
    return Object.entries(layout)
      .reverse()
      .map(([levelName, layout]) => {
        const [row, col] = Object.entries(layout)[0];
        return (
          <div key={levelName} style={{ width: "450px" }}>
            <Grid container>
              {renderLevel(levelName, parseInt(row), parseInt(col))}
            </Grid>
          </div>
        );
      });
  };

  return <div>{renderLevels()}</div>;
};

Layout.propTypes = {
  data: PropTypes.object.isRequired,
  currSide: PropTypes.string.isRequired,
  greenPigeonhole: PropTypes.array,
};

export default Layout;
