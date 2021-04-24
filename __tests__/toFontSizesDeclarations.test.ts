import { toFontSizesDeclarations } from "../src";

describe("toFontSizesDeclarations", () => {
  test('given theme with no fontSizes returns ""', () => {
    const result = toFontSizesDeclarations({
      theme: {},
    });
    expect(result).toMatchInlineSnapshot(`""`);
  });

  test('given theme with empty fontSizes returns ""', () => {
    const result = toFontSizesDeclarations({
      theme: { fontSizes: [] },
    });
    expect(result).toMatchInlineSnapshot(`""`);
  });

  test(`given theme with fontSizes ['12px'] returns "--font-size: 12px;"`, () => {
    const result = toFontSizesDeclarations({
      theme: { fontSizes: ["12px"] },
    });
    expect(result).toMatchInlineSnapshot(`"--font-size: 12px;"`);
  });

  test(`given theme with fontSizes ['12px', '14px'] and no breakpoints returns "--font-size: 12px;"`, () => {
    const result = toFontSizesDeclarations({
      theme: { fontSizes: ["12px", "14px"] },
    });
    expect(result).toMatchInlineSnapshot(`"--font-size: 12px;"`);
  });

  test(`given theme with fontSizes ['12px', '14px'] and breakpoints ['768px'] returns "--font-size: 12px;@media screen and (min-width: 768px) { --font-size: 14px; }"`, () => {
    const result = toFontSizesDeclarations({
      theme: { fontSizes: ["12px", "14px"], breakpoints: ["768px"] },
    });
    expect(result).toMatchInlineSnapshot(
      `"--font-size: 12px;@media screen and (min-width: 768px) { --font-size: 14px; }"`
    );
  });
});
