import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface MessageSnackbarProps {
  messages: string[];
}

function MessageSnackbar() {
  const messages = ["asd"];
  const [messageQueue, setMessageQueue] = useState<string[]>(messages);

  const handleClose = () => {
    if (messageQueue.length > 0) {
      setMessageQueue((prevQueue) => prevQueue.slice(1));
    }
  };

  return (
    <div>
      <Snackbar
        key={"asd"}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={true}
        onClose={handleClose}
      >
        <div>
          {messageQueue.map((message, index) => (
            <Alert key={index} severity="error" onClose={handleClose}>
              {message}
            </Alert>
          ))}
        </div>
      </Snackbar>
    </div>
  );
}

export default React.memo(MessageSnackbar);
