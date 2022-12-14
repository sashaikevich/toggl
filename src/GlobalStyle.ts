import { createGlobalStyle } from "styled-components"
import "@fontsource/inter"

const GlobalStyle = createGlobalStyle`
  html,
  body {
    min-height: 100vh;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: "Inter";
  }

  body {
    padding: 1em;
  }
  
  * {
    box-sizing: border-box;
    color: inherit;
    font: inherit;
  }
   ul, li {
    list-style: none;
   }
   button {
    border: none;
    outline: none;
    background-color: transparent;
   }
`
export default GlobalStyle
