import React from "react";
import { Checkbox, CheckboxProps, withStyles } from "@material-ui/core";

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
