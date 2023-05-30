import React from "react";
import { Checkbox, CheckboxProps, withStyles } from "@material-ui/core";
import { PRIMARY_COLOR } from "../../consts/const";

const GreenCheckbox = withStyles({
  root: {
    color: PRIMARY_COLOR,
    "&$checked": {
      color: PRIMARY_COLOR,
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export default GreenCheckbox;
