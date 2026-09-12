/** Pixel coordinates in the supplied 1536 × 1024 exhibition artwork. */
export type ExhibitPosition = {
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const columns = [
  52, 132, 211, 292, 372, 452, 533, 613, 694, 775, 855, 937, 1028, 1107, 1187,
  1267, 1347, 1424,
];
const rows: { y: number; numbers: (number | null)[]; lower?: boolean }[] = [
  {
    y: 148,
    numbers: [
      1,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      2,
    ],
  },
  {
    y: 226,
    numbers: [
      3,
      4,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      5,
      6,
      7,
      8,
      9,
      10,
    ],
  },
  {
    y: 313,
    numbers: [
      11,
      12,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      13,
      14,
      15,
      16,
      17,
      18,
    ],
  },
  { y: 400, numbers: Array.from({ length: 18 }, (_, i) => i + 19) },
  { y: 489, numbers: Array.from({ length: 18 }, (_, i) => i + 37) },
  {
    y: 579,
    numbers: [
      55, 56, 57, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
    ],
    lower: true,
  },
  {
    y: 670,
    numbers: [
      87, 88, 89, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
      116, 117, 118,
    ],
    lower: true,
  },
];

export const exhibitPositions: ExhibitPosition[] = rows
  .flatMap((row) =>
    row.numbers.flatMap((number, column) =>
      number === null
        ? []
        : [
            {
              number,
              // La and Ac have narrower main-table boxes beside the series
              // markers. Every other column remains aligned with rows 4–5.
              x: row.lower && column === 2 ? 231 : (columns[column] ?? 52),
              y: row.y,
              width: row.lower && column === 2 ? 56 : column === 17 ? 69 : 73,
              height: row.y === 148 ? 74 : 78,
            },
          ],
    ),
  )
  .concat(
    [57, 89].flatMap((start, row) =>
      Array.from({ length: 15 }, (_, column) => ({
        number: start + column,
        x: 229 + column * 73.7,
        y: row === 0 ? 792 : 880,
        width: 70,
        height: 77,
      })),
    ),
  );

export function specimenStyle(position: ExhibitPosition) {
  return {
    backgroundImage: 'url("/images/periodic-table/element-wall.jpg")',
    backgroundSize: `${(1536 / position.width) * 100}% ${(1024 / position.height) * 100}%`,
    backgroundPosition: `${(position.x / (1536 - position.width)) * 100}% ${(position.y / (1024 - position.height)) * 100}%`,
  };
}

export function getPosition(number: number) {
  return (
    exhibitPositions.filter((position) => position.number === number).at(-1) ??
    exhibitPositions[0]!
  );
}
