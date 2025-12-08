import React from "react";

interface ColValueFormatterProps {
  value: string;
  highlight?: string;
}

const ColValueFormatter: React.FC<ColValueFormatterProps> = ({ value, highlight }) => {
  if (!highlight) return <>{value}</>;

  // Case-insensitive match
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = value.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <strong key={i}>
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
};

export default React.memo(ColValueFormatter);
