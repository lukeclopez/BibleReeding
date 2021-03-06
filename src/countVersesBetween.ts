import { shallowEqual } from "react-redux";

import {
  range,
  getBookNames,
  countChaptersFor,
  countVersesForBook,
  countVersesForChapter
} from "./utils";

interface BookChapterVerse {
  book: string;
  chapter: number;
  verse: number;
}

export const inSameBook = (
  starting: BookChapterVerse,
  ending: BookChapterVerse
): number => {
  if (shallowEqual(starting, ending)) {
    return 1;
  }

  let versesRead = 0;
  let firstChapter = true;
  for (var i = starting.chapter; i < ending.chapter; i++) {
    const versesInChapter: number = countVersesForChapter(starting.book, i);
    if (firstChapter) {
      const excludeVerses = starting.verse - 1;
      versesRead += versesInChapter - excludeVerses;
      firstChapter = false;
    } else {
      versesRead += versesInChapter;
    }
  }
  versesRead += ending.verse;

  return versesRead;
};

export const inDifferentBooks = (
  starting: BookChapterVerse,
  ending: BookChapterVerse
): number => {
  const bookNames = getBookNames();

  // Find the books between the starting book and ending book.
  const startingIndex = bookNames.indexOf(starting.book);
  const endingIndex = bookNames.indexOf(ending.book);
  const booksInRange = bookNames.slice(startingIndex, endingIndex + 1);

  // For each of those books, add their verses to our count.
  // Note that this includes the last book in our range.
  // Example: Matthew 1:1 to John 1:1 includes all verses from Matt, Mark, Luke, and John.
  let totalVerses = 0;
  booksInRange.forEach(b => {
    totalVerses += countVersesForBook(b);
  });

  // Any chapters and verses that fall before our starting chapter and verse should
  // be excluded from our count.
  // Example: If our range is Matthew 5:2 to John 1:1, we must subtract all verses
  // in Matthew from Matthew 1:1 to Matthew 5:1 because earlier, we added all the
  // verses in Matthew 5:2.
  const chaptersBeforeStarting = range(0, starting.chapter - 1);
  chaptersBeforeStarting.forEach(c => {
    totalVerses -= countVersesForChapter(starting.book, c);
  });
  totalVerses -= starting.verse - 1;

  // Any chapters and verses that fall after our ending chapter and verse should
  // be excluded from our count.
  // Example: If our range is Matthew 1:1 to John 5:1, we must subtract all verses
  // in John from John 5:2 to the end of the book because earlier, we added all the
  // verses in John.
  const chaptersAfterEnding = range(
    ending.chapter,
    countChaptersFor(ending.book)
  );
  chaptersAfterEnding.forEach(c => {
    const versesInChapter = countVersesForChapter(ending.book, c);
    totalVerses -= versesInChapter;
  });
  const versesInEndingChapter = countVersesForChapter(
    ending.book,
    ending.chapter
  );
  totalVerses -= versesInEndingChapter - ending.verse;

  return totalVerses;
};

const countVersesBetween = (
  starting: BookChapterVerse,
  ending: BookChapterVerse
): number => {
  if (starting.book === ending.book) {
    return inSameBook(starting, ending);
  } else {
    return inDifferentBooks(starting, ending);
  }
};

export default countVersesBetween;
