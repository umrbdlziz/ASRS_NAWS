import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

const CustomDialog = ({ open, onClose, onComplete, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{message.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onComplete} color="secondary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CustomDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onComplete: PropTypes.func,
  message: PropTypes.object,
};

export default CustomDialog;
