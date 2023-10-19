import { css } from "@emotion/react";

export const notificationsWrapperCss = css`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  bottom: 60px;
  @media (min-width: 768px) {
    bottom: 0px;
  }
`;
