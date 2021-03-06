import React, { useState } from "react";

import { updateSelection } from "../redux/actions";
import { Row, SelectPicker, InputNumber } from "rsuite";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import InfoPanel from "./infoPanel";
import {
  getBookNames,
  countChaptersFor,
  countVersesForChapter
} from "../utils";

export enum Roles {
  Start = "start",
  End = "end"
}

export interface VerseSelectProps {
  title: string;
  role: Roles;
}

interface BookData {
  [index: string]: any;
  book: string;
  chapter: number;
  verse: number;
}

type StringOrNum = string | number;

const VerseSelect: React.SFC<VerseSelectProps> = ({
  title,
  role
}: VerseSelectProps) => {
  const globalSelection = useSelector((state: any) => state[role]);
  const { book, chapter, verse } = globalSelection;
  const [prevSelection, setPrevSelection] = useState<BookData>(globalSelection);

  const dispatch = useDispatch();

  const handleChange = (role: string, type: string, value: StringOrNum) => {
    const curSelection: BookData = { ...globalSelection };
    curSelection[type] = value;

    // This `if` is to ensure that the values
    // come out as `Number`s, not strings.
    if (type !== "book") {
      value = Number(value);
    }

    if (!shallowEqual(curSelection, prevSelection)) {
      dispatch(updateSelection({ role, type, value }));
      setPrevSelection(curSelection);
    }
  };

  const bookNames = getBookNames();

  return (
    <InfoPanel>
      <Row>{title}</Row>
      <Row>
        <SelectPicker
          value={book}
          data={bookNames.map(bookName => {
            return { label: bookName, value: bookName };
          })}
          onChange={value => handleChange(role, "book", value)}
          cleanable={false}
          className="picker"
        />
      </Row>
      <Row>
        <InputNumber
          value={chapter}
          prefix={"Chapter"}
          max={countChaptersFor(book)}
          min={1}
          onChange={value => handleChange(role, "chapter", value)}
          className="picker"
        />
      </Row>
      <Row>
        <InputNumber
          value={verse}
          prefix={"Verse"}
          max={countVersesForChapter(book, chapter)}
          min={1}
          onChange={value => handleChange(role, "verse", value)}
          className="picker"
        />
      </Row>
    </InfoPanel>
  );
};

export default VerseSelect;
