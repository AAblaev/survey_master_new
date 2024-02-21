import React, { useEffect } from "react";
import { css } from "@emotion/react";

type IInfoPageProps = {
  html: string;
  useRedirect: boolean;
  redirectLink: string;
};

const InfoPage: React.FC<IInfoPageProps> = ({
  html,
  useRedirect,
  redirectLink,
}) => {
  //
  useEffect(() => {
    if (!useRedirect) return;
    const redirectTimer = setTimeout(() => {
      window.location.href = redirectLink;
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [redirectLink, useRedirect]);
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
};

export default InfoPage;
