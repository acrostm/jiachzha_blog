import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Compile these standalone data modules in memory so tests work on Node 20+.
async function loadData(path) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const { elements, categories, getElement } = await loadData(
  "../features/periodic-table/elements.ts",
);
const { exhibitPositions, getPosition, specimenStyle } = await loadData(
  "../features/periodic-table/positions.ts",
);

test("118 unique elements have complete educational content and valid categories", () => {
  assert.deepEqual(
    elements.map((e) => e.number),
    Array.from({ length: 118 }, (_, i) => i + 1),
  );
  assert.equal(new Set(elements.map((e) => e.symbol)).size, 118);
  const validCategories = new Set(categories.map((c) => c.id));
  for (const element of elements) {
    assert.ok(validCategories.has(element.categoryId), element.symbol);
    for (const field of [
      "name",
      "englishName",
      "atomicMass",
      "summary",
      "discovery",
    ]) {
      assert.ok(element[field]?.length > 0, `${element.symbol}: ${field}`);
    }
    assert.ok(element.uses.length >= 2, element.symbol);
    assert.equal(new URL(element.sourceUrl).hostname, "periodic-table.rsc.org");
  }
});

test("element lookup supports names, symbols and atomic numbers without false matches", () => {
  for (const element of elements) {
    for (const query of [
      element.number,
      String(element.number),
      element.symbol.toLowerCase(),
      element.name,
      element.englishName,
    ]) {
      assert.equal(getElement(query)?.number, element.number);
    }
  }
  for (const query of [0, 119, "", "unobtainium", "NaCl"])
    assert.equal(getElement(query), undefined);
});

test("every element has a bounded, non-overlapping exhibit target", () => {
  assert.equal(exhibitPositions.length, 120);
  assert.equal(new Set(exhibitPositions.map((p) => p.number)).size, 118);
  for (const p of exhibitPositions) {
    assert.ok(getElement(p.number));
    assert.ok(p.x >= 0 && p.y >= 0 && p.width > 0 && p.height > 0);
    assert.ok(p.x + p.width <= 1536 && p.y + p.height <= 1024);
    assert.ok(!JSON.stringify(specimenStyle(p)).match(/NaN|Infinity/));
  }
  for (let i = 0; i < exhibitPositions.length; i++) {
    for (const b of exhibitPositions.slice(i + 1)) {
      const a = exhibitPositions[i];
      assert.ok(
        a.x + a.width <= b.x ||
          b.x + b.width <= a.x ||
          a.y + a.height <= b.y ||
          b.y + b.height <= a.y,
        `${a.number} overlaps ${b.number}`,
      );
    }
  }
  assert.equal(getPosition(57).y, 792);
  assert.equal(getPosition(89).y, 880);
});

test("key scientific properties and periodic families are consistent", () => {
  assert.deepEqual(
    elements.filter((e) => e.phase === "liquid").map((e) => e.symbol),
    ["Br", "Hg"],
  );
  assert.deepEqual(
    elements.filter((e) => e.categoryId === "alkali").map((e) => e.symbol),
    ["Li", "Na", "K", "Rb", "Cs", "Fr"],
  );
  assert.deepEqual(getElement("Na").shells, [2, 8, 1]);
  assert.equal(
    getElement("Na").shells.reduce((sum, n) => sum + n, 0),
    11,
  );
  assert.equal(getElement("Og").phase, "unknown");
});
