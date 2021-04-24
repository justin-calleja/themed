import React from "react";
import { default as pretty } from "pretty";
import { render } from "@testing-library/react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { Theme, toFontSizesDeclarations } from "../src";

test("render globally", () => {
  const theme: Theme = {
    fontSizes: ["1.6rem", "2rem", "2.4rem"],
    breakpoints: ["768px", "1024px"],
  };

  const GlobalStyles = createGlobalStyle`
  :root {
    ${toFontSizesDeclarations}
  }
`;

  render(
    <ThemeProvider theme={theme}>
      <GlobalStyles />
    </ThemeProvider>
  );

  expect(pretty(document.head.innerHTML)).toMatchInlineSnapshot(`
    "<style data-styled=\\"active\\" data-styled-version=\\"5.2.3\\">
      :root {
        --font-size: 1.6rem;
      }

      @media screen and (min-width:768px) {
        :root {
          --font-size: 2rem;
        }
      }

      @media screen and (min-width:1024px) {
        :root {
          --font-size: 2.4rem;
        }
      }
    </style>"
  `);
});
