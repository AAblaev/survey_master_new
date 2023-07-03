import React from "react";
import { css } from "@emotion/react";

type IInfoPageProps = {
  html: string;
};

const InfoPage: React.FC<IInfoPageProps> = ({ html }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

export default InfoPage;
