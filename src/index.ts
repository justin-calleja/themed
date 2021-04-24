export type Theme = {
  colors?: { [colorName: string]: string } & {
    modes?: { [modeName: string]: { [colorName: string]: string } };
  };
  fontSizes?: string[];
  breakpoints?: string[];
  /*
  Up to you to provide _state if you want it:

    [colorModeName, setColorModeName] = useState()
   <ThemeProvider
      theme={{
        ...theme,
        _state: {
            colorModeName,
        }
      }}
    >
  */
  _state?: {
    colorModeName: string;
  };
};

export type ThemeProp = { theme: Theme };

export type VarDeclarations = { name: string; values: string[] };

export type Opts = {
  newLine: boolean;
};

/**
 * Given the name and values a variable should take, returns a function that given the theme (with breakpoints),
 * returns a string of CSS declarations of the variable at mobile first and it's redeclaration at different breakpoints.
 */
export function toVarDeclarationsFactory(
  { name, values }: Partial<VarDeclarations>,
  opts: Opts = { newLine: false },
) {
  return ({ theme }: ThemeProp) => {
    if (name === undefined || values === undefined || values.length === 0) {
      return '';
    }

    const mobileVal = values[0];
    let result = '';

    if (mobileVal) {
      result += `--${name}: ${mobileVal};${opts.newLine ? '\n' : ''}`;
    }

    if (theme.breakpoints === undefined) {
      return result;
    }

    const otherVals = values.slice(1);
    for (let i = 0; i < otherVals.length; i++) {
      const bp = theme.breakpoints[i];
      if (bp) {
        result += `@media screen and (min-width: ${bp}) { --${name}: ${
          otherVals[i]
        }; }${opts.newLine ? '\n' : ''}`;
      }
    }

    return result;
  };
}

export function toFontSizesDeclarations({
  theme,
  name = 'font-size',
  opts,
}: ThemeProp & { name?: string; opts?: Opts }) {
  return toVarDeclarationsFactory(
    { name, values: theme.fontSizes },
    opts,
  )({ theme });
}

export function toColorsCSSFactory(varName = 'colors') {
  return ({ theme }: ThemeProp) => {
    if (theme.colors === undefined) {
      return '';
    }

    const { modes, ...colors } = theme.colors;
    const colorModeName = theme._state?.colorModeName;

    return Object.entries(colors)
      .map(
        ([key, val]) =>
          `--${varName}-${key}: ${
            colorModeName ? modes?.[colorModeName]?.[key] ?? val : val
          };`,
      )
      .join('\n');
  };
}
