import React from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

interface IProps {
  message: string;
  setMessage: (message: string) => void;
}

export default function Alert(props: IProps) {
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={props.message.length > 0}
        autoHideDuration={6000}
        onClose={() => props.setMessage("")}
        message={props.message}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={() => props.setMessage("")}
            >
              CLOSE
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => props.setMessage("")}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
