import React, { useEffect } from "react";
import { css } from "@emotion/react";
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  withStyles,
} from "@material-ui/core";
import GreenCheckbox from "../../common/GreenCheckbox";

export type INotAnyOnePrors = {};

const NotAnyOne: React.FC<INotAnyOnePrors> = () => {
  return (
    <FormControlLabel
      control={
        <GreenCheckbox checked={true} onChange={() => {}} name={"name"} />
      }
      label="Ничего из вышеперечисленного"
      key={"notAnyOne"}
    />
  );
};

export default NotAnyOne;
