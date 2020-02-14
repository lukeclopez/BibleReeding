import React, { useState } from "react";

import { useSelector } from "react-redux";
import deepEqual from "deep-equal";

import countVersesBetween from "./../data/countVersesBetween";

export interface ResultProps {}

const Result: React.SFC<ResultProps> = () => {
  const [prevState, setPrevState] = useState<any>(null);

  // I compare `prevState` to `state` because
  // the default equality function is given
  // two copies of `state`.
  const eqChecker = (state: any) => {
    if (!deepEqual(state, prevState)) {
      setPrevState(state);
      return false;
    }
    return true;
  };

  const state = useSelector((state: any) => {
    return state;
  }, eqChecker);
  const { start, end } = state;

  const verses = countVersesBetween(start, end);
  const gtOne = verses > 1;

  return (
    <p>
      There {gtOne ? "are" : "is"} {verses} {gtOne ? "verses" : "verse"} between{" "}
      {start.book} {start.chapter}:{start.verse} and {end.book} {end.chapter}:
      {end.verse}.
    </p>
  );
};

export default Result;
