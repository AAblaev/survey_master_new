import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Radio, { RadioProps } from "@material-ui/core/Radio";
import { PRIMARY_COLOR } from "../../consts/const";

const GreenRadio = withStyles({
  root: {
    color: "grey",
    "&$checked": {
      color: PRIMARY_COLOR,
    },
  },
  checked: {},
})((props: RadioProps) => <Radio size="small" color="default" {...props} />);

export default GreenRadio;
