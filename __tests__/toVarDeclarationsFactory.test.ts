import { toVarDeclarationsFactory } from '../src';
import type { ThemeProp, VarDeclarations, Opts } from '../src';

type TestTuple = [
  varDeclarations: Partial<VarDeclarations>,
  opts: Opts | undefined,
  props: ThemeProp,
  expectedResult: string,
];

const testToVarDeclarationsFactory = (testTuples: TestTuple[]) => {
  test.each(testTuples)(
    '%#: test when given varDeclarations %j, opts %j, and props %j as arguments.',
    (varDeclarations, opts, props, expectedResult) => {
      expect(toVarDeclarationsFactory(varDeclarations, opts)(props)).toBe(
        expectedResult,
      );
    },
  );
};

describe('toVarDeclarationsFactory', () => {
  testToVarDeclarationsFactory([
    [{ values: ['12px'] }, undefined, { theme: { breakpoints: [] } }, ''],
    [
      { name: 'font-size', values: ['1.6rem', '2rem', '2.4rem'] },
      undefined,
      { theme: { breakpoints: ['768px', '1024px'] } },
      '--font-size: 1.6rem;@media screen and (min-width: 768px) { --font-size: 2rem; }@media screen and (min-width: 1024px) { --font-size: 2.4rem; }',
    ],
    [
      { name: 'font-size', values: ['1.6rem', '2rem', '2.4rem'] },
      { newLine: true },
      { theme: { breakpoints: ['768px', '1024px'] } },
      `--font-size: 1.6rem;
@media screen and (min-width: 768px) { --font-size: 2rem; }
@media screen and (min-width: 1024px) { --font-size: 2.4rem; }
`,
    ],
    [
      { name: 'font-size', values: ['1.6rem'] },
      undefined,
      { theme: {} },
      '--font-size: 1.6rem;',
    ],
    [
      { name: 'font-size', values: ['1.6rem'] },
      undefined,
      { theme: { breakpoints: ['768px', '1024px'] } },
      '--font-size: 1.6rem;',
    ],
    [
      { name: 'f-size', values: ['1.6rem', '2rem'] },
      undefined,
      { theme: { breakpoints: ['768px', '1024px'] } },
      '--f-size: 1.6rem;@media screen and (min-width: 768px) { --f-size: 2rem; }',
    ],
  ]);

  test(`given varDeclarations {"name":"varName","values":["1.6rem","2rem","3rem]}, opts { newLine: true }, and passing props to returned function of { "theme":{fontSizes: ["88px", "99px"], "breakpoints":["768px"]} }`, () => {
    const result = toVarDeclarationsFactory(
      // should pick up these values (not the ones in theme below):
      { name: 'varName', values: ['1.6rem', '2rem', '3rem'] },
      { newLine: true },
    )({
      theme: { fontSizes: ['88px', '99px'], breakpoints: ['768px'] },
    });
    expect(result).toMatchInlineSnapshot(`
      "--varName: 1.6rem;
      @media screen and (min-width: 768px) { --varName: 2rem; }
      "
    `);
  });
});
