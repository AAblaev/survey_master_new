import React from "react";
import { Checkbox, CheckboxProps } from "@mui/material";
import { withStyles } from "@mui/styles";

const GreenCheckbox = withStyles({
  root: {
    // color: PRIMARY_COLOR,
    "&$checked": {
      // color: PRIMARY_COLOR,
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="primary" {...props} />);

export default GreenCheckbox;
