import { createGlobalStyle } from "styled-components";
import { ResetStyles } from "./reset";

export const GlobalStyles = createGlobalStyle`
  ${ResetStyles};
  body {
    transition: 0.3s;
    overflow-x: hidden;
    background-color: ${(props) => props.theme.colors.white};
  };
`;