import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Pattern = ({ patterns, handleDeleteBtn }) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} style={{ marginTop: "16px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pattern ID</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patterns.map((pattern) => (
            <TableRow key={pattern.pattern_id}>
              <TableCell>{pattern.pattern_id}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    navigate(`/warehouse/edit/${pattern.pattern_id}`)
                  }
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteBtn("pattern", pattern.pattern_id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Pattern.propTypes = {
  patterns: PropTypes.array.isRequired,
  handleDeleteBtn: PropTypes.func.isRequired,
};

export default Pattern;
