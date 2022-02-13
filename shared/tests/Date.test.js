import "shared/overrides/Date.js";

describe("Quarters", () => {
  test("Quarter Start Future", () => {
    let previous;
    const date = new Date().getYearStart();
    for (let i = 0; i < 1000; i++) {
      if (i % 3 === 0) {
        previous = date.getQuarterStart({ monthOffset: i }).getTime();
      }
      expect(date.getQuarterStart({ monthOffset: i }).getTime()).toBe(previous);
    }
  });

  test("Quarter Start Past", () => {
    let previous;
    const date = new Date().getYearEnd({ yearOffset: -1 });
    for (let i = 0; i < 1000; i++) {
      if (i % 3 === 0) {
        previous = date.getQuarterStart({ monthOffset: -i }).getTime();
      }
      expect(date.getQuarterStart({ monthOffset: -i }).getTime()).toBe(previous);
    }
  });

  test("Quarter End Future", () => {
    let previous;
    const date = new Date().getYearStart();
    for (let i = 0; i < 1000; i++) {
      if (i % 3 === 0) {
        previous = date.getQuarterEnd({ monthOffset: i }).getTime();
      }
      expect(date.getQuarterEnd({ monthOffset: i }).getTime()).toBe(previous);
    }
  });

  test("Quarter End Past", () => {
    let previous;
    const date = new Date().getYearEnd({ yearOffset: -1 });
    for (let i = 0; i < 1000; i++) {
      if (i % 3 === 0) {
        previous = date.getQuarterEnd({ monthOffset: -i }).getTime();
      }
      expect(date.getQuarterEnd({ monthOffset: -i }).getTime()).toBe(previous);
    }
  });
});

describe("Weeks", () => {
  test("Week Start Future", () => {
    let expected;
    let start = new Date().getWeekStart();
    for (let i = 0; i < 1000; i++) {
      const offset = i % 7;
      if (offset === 0) {
        if (expected != null) {
          start = start.getWeekStart({ dateOffset: 7 });
        }
        expected = start.getTime();
      }
      expect(start.getWeekStart({ dateOffset: offset }).getTime()).toBe(expected);
    }
  });

  test("Week Start Past", () => {
    let expected;
    let start = new Date().getYearStart().getWeekStart();
    for (let i = 0; i < 1000; i++) {
      const offset = i % 7;
      if (offset === 0) {
        if (expected != null) {
          start = start.getWeekStart({ dateOffset: -7 });
        }
        // We actually want the previous week
        start.setDate(start.getDate() - 1);
        expected = start.getWeekStart().getTime();
      }
      expect(start.getWeekStart({ dateOffset: -offset }).getTime()).toBe(expected);
    }
  });

  test("Week End Future", () => {
    let expected;
    let start = new Date().getWeekStart();
    for (let i = 0; i < 1000; i++) {
      const offset = i % 7;
      if (offset === 0) {
        if (expected != null) {
          start = start.getWeekStart({ dateOffset: 7 });
        }
        expected = start.getWeekStart({ isEnd: true }).getTime();
      }
      expect(start.getWeekStart({ dateOffset: offset, isEnd: true }).getTime()).toBe(expected);
    }
  });

  test("Week End Past", () => {
    let expected;
    let start = new Date().getYearStart().getWeekStart();
    for (let i = 0; i < 1000; i++) {
      const offset = i % 7;
      if (offset === 0) {
        if (expected != null) {
          start = start.getWeekStart({ dateOffset: -7 });
        }
        // We actually want the previous week
        start.setDate(start.getDate() - 1);
        expected = start.getWeekStart({ isEnd: true }).getTime();
      }
      expect(start.getWeekStart({ dateOffset: -offset, isEnd: true }).getTime()).toBe(expected);
    }
  });
});
