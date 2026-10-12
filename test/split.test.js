import { test } from "node:test";
import assert from "node:assert/strict";
import { split, formatDollars } from "../src/split.js";

test("splits an even amount equally", () => {
  assert.deepEqual(split(90, 3), [30, 30, 30]);
});

test("splits between two people", () => {
  assert.deepEqual(split(25.5, 2), [12.75, 12.75]);
});

test("one person pays the whole bill", () => {
  assert.deepEqual(split(42.42, 1), [42.42]);
});

test("assigns leftover cents to the first people", () => {
  assert.deepEqual(split(100, 3), [33.34, 33.33, 33.33]);
  assert.deepEqual(split(0.01, 3), [0.01, 0, 0]);
  assert.deepEqual(split(10, 6), [1.67, 1.67, 1.67, 1.67, 1.66, 1.66]);
});

test("splits a zero amount", () => {
  assert.deepEqual(split(0, 3), [0, 0, 0]);
});

test("preserves every cent from zero to 1000 dollars for 1 to 100 people", () => {
  for (let cents = 0; cents <= 100000; cents++) {
    for (let people = 1; people <= 100; people++) {
      const shares = split(cents / 100, people);
      let total = 0;
      let min = Infinity;
      let max = 0;
      let valid = true;
      for (const share of shares) {
        const shareCents = Math.round(share * 100);
        valid = valid && share >= 0 && share === shareCents / 100;
        total += shareCents;
        min = Math.min(min, shareCents);
        max = Math.max(max, shareCents);
      }
      assert.ok(
        shares.length === people && valid && total === cents && max - min <= 1,
        `${cents} cents split between ${people} people`,
      );
    }
  }
});

test("rejects a negative amount", () => {
  assert.throws(() => split(-5, 2), RangeError);
});

test("rejects a non-integer number of people", () => {
  assert.throws(() => split(10, 2.5), RangeError);
  assert.throws(() => split(10, 0), RangeError);
});

test("formats dollars with two decimals", () => {
  assert.equal(formatDollars(12.5), "$12.50");
});
