import React from "react";
import { withStyles } from "@mui/styles";

import Radio, { RadioProps } from "@mui/material/Radio";

const GreenRadio = withStyles({
  // root: {
  //   color: "grey",
  //   "&$checked": {
  //     color: PRIMARY_COLOR,
  //   },
  // },
  // checked: {},
})((props: RadioProps) => <Radio size="small" color="primary" {...props} />);

export default GreenRadio;
