import React from "react";
import { Result, Button } from "antd";

const NotFound = () => {

  const emptyStyle = {
    height: 'calc(100vh - 100px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <div style={emptyStyle}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  )
}

export default NotFound;