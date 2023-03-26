const { getCurrentRound, isNormalVotingEnabled, isEndgameVotingEnabled, getLastRound } = require("../utils/config");

const roundDates = [
  [new Date("2023-03-18T19:59:59+0100"), 0],
  [new Date("2023-03-19T20:00:01+0100"), 1],
  [new Date("2023-03-26T19:59:59+0200"), 1], //summertime
  [new Date("2023-03-26T20:00:01+0200"), 2], //summertime
  [new Date("2023-04-02T19:59:59+0200"), 2], //summertime
  [new Date("2023-04-02T20:00:01+0200"), 3], //summertime
  [new Date("2023-04-09T19:59:59+0200"), 3], //summertime
  [new Date("2023-04-09T20:00:01+0200"), 4], //summertime
  [new Date("2023-04-16T19:59:59+0200"), 4], //summertime
  [new Date("2023-04-16T20:00:01+0200"), 5], //summertime
  [new Date("2023-04-23T19:59:59+0200"), 5], //summertime
  [new Date("2023-04-23T20:00:01+0200"), 6], //summertime
  [new Date("2023-04-30T19:59:59+0200"), 6], //summertime
  [new Date("2023-04-30T20:00:01+0200"), 7], //summertime
  [new Date("2023-05-07T19:59:59+0200"), 7], //summertime
  [new Date("2023-05-07T20:00:01+0200"), 8], //summertime
  [new Date("2023-05-12T20:00:01+0200"), 8], //summertime
]; // input and expected output

test.each(roundDates)("Current round: given %p as arguments, returns %p", (dateObj, expectedResult) => {
  const mockedDateObject = jest.spyOn(global, "Date");
  mockedDateObject.mockImplementation(() => dateObj);
  expect(getCurrentRound()).toEqual(expectedResult);
  mockedDateObject.mockRestore();
});

const votingTimes = [
  [new Date("2023-03-19T19:59:59+0100"), 0, false],
  [new Date("2023-03-19T20:00:01+0100"), 1, false],
  [new Date("2023-03-19T21:29:59+0100"), 1, false],
  [new Date("2023-03-19T21:30:00+0100"), 1, true],
  [new Date("2023-03-26T19:29:59+0200"), 1, true], //summertime
  [new Date("2023-03-26T20:00:01+0200"), 2, false], //summertime
  [new Date("2023-03-26T21:29:59+0200"), 2, false], //summertime
  [new Date("2023-03-26T21:30:00+0200"), 2, true], //summertime
];

test.each(votingTimes)(
  "Normal voting enabled: given %p and %p as arguments, returns %p",
  (dateObj, round, expectedResult) => {
    const mockedDateObject = jest.spyOn(global, "Date");
    const mockedCurrentRound = jest.spyOn(require("../utils/config"), "getCurrentRound");
    mockedCurrentRound.mockImplementation(() => round);
    mockedDateObject.mockImplementation(() => dateObj);

    expect(isNormalVotingEnabled()).toEqual(expectedResult);

    mockedDateObject.mockRestore();
    mockedCurrentRound.mockRestore();
  }
);

test("End game voting enabled", () => {
  expect(isEndgameVotingEnabled()).toBe(false);
});

test("Last round", () => {
  expect(getLastRound()).toBe(8);
});
