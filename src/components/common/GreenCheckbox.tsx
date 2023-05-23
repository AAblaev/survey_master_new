import React from "react";
import { Checkbox, CheckboxProps, withStyles } from "@material-ui/core";

const GreenCheckbox = withStyles({
  root: {
    color: "#46acaf",
    "&$checked": {
      color: "#46acaf",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export default GreenCheckbox;
