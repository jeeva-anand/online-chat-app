import { Card, CardContent, Typography } from "@material-ui/core";
import React, { forwardRef } from "react";
import "./Message.css";

const Message = forwardRef(({ message, username }, ref) => {
  const isUser = username === message.username;
  return (
    <div ref={ref} className={`message ${isUser && "message__user"}`}>
      <Card className={isUser ? "message__userCard" : "message__guestCard"}>
        <CardContent>
          <Typography
            color="textPrimary"
            component="h6"
            variant="h6"
            align="left"
          >
            {!isUser && `${message.username || "Unknown user"}`}
          </Typography>
          <Typography color="textPrimary" component="h3" variant="h5">
            {message.message}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
});

export default Message;
