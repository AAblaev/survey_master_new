import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Radio, { RadioProps } from "@material-ui/core/Radio";

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
