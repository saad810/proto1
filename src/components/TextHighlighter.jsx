import React from "react";
import { Diff, diffWords } from "diff";

const HighlightedText = ({ original, corrected }) => {
  const diff = diffWords(original, corrected);

  return (
    <p>
      {diff.map((part, index) => (
        <span
          key={index}
          style={{ backgroundColor: part.added ? "yellow" : part.removed ? "lightcoral" : "transparent" }}
        >
          {part.value}
        </span>
      ))}
    </p>
  );
};

const TextHighlighter = ({ data }) => {
  return (
    <div>
      {data.results.map((item, index) => (
        <HighlightedText
          key={index}
          original={item.sentence}
          corrected={item.corrected_sentence}
        />
      ))}
    </div>
  );
};

export default TextHighlighter;
