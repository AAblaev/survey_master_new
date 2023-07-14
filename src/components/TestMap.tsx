import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { IState } from "../types";

export type ITestMap = ConnectedProps<typeof connector>;

const TestMap: React.FC<ITestMap> = ({ children }) => {
  return <div>{children}</div>;
};

const mapStateToProps = (state: IState, props: any) => {
  console.log("mapStateToProps");
  return {
    ...props,
  };
};

const mapDispathToProps = () => {
  console.log("mapDispathToProps");

  return {
    props: {},
  };
};

const connector = connect(mapStateToProps, mapDispathToProps);

export default connector(TestMap);
