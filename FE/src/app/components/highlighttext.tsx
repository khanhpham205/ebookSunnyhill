// import React from 'react';


const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Props type
interface HighlightTextProps {
  name: string;
  name_unsigned: string;
  userInput: string;
  highlightClassName?: string;
  normalClassName?: string;
}

// Component
const HighlightText: React.FC<HighlightTextProps> = ({
  name,
  name_unsigned,
  userInput,
  highlightClassName = 'text-blue-600 font-semibold',
  normalClassName = '',
}) => {
    const rawWords = userInput.trim().toLowerCase().split(/\s+/);
    const keywords = rawWords.map(removeVietnameseTones);
    
    const unsigned = name_unsigned;
    const original = name;
    
    const result: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    
    for (const keyword of keywords) {
        const matchIndex = unsigned.indexOf(keyword, lastIndex);
        if (matchIndex === -1) continue;
        
        console.log(name_unsigned);
        
        const pre = unsigned.slice(lastIndex, matchIndex);
        const preLen = pre.length;
        const matchLen = keyword.length;
        
        console.log(name.slice(matchIndex,matchIndex+matchLen));

        const origStart = lastIndex + (original.slice(lastIndex).indexOf(pre) || 0) + preLen;
        const origEnd = origStart + matchLen;

        if (origStart > lastIndex) {
            result.push({
                text: original.slice(lastIndex, origStart),
                highlight: false,
            });
        }

        result.push({
            text: original.slice(origStart, origEnd),
            highlight: true,
        });

        lastIndex = origEnd;
    }

    if (lastIndex < original.length) {
        result.push({
        text: original.slice(lastIndex),
        highlight: false,
        });
    }

    return (
        <span>
        {result.map((part, index) => (
            <span
            key={index}
            className={(part.highlight) ? highlightClassName : normalClassName}
            >
            {part.text}
            </span>
        ))}
        </span>
    );
};

// import React from 'react';

// type HighlightTextProps = {
//     text: string;
//     userInput: string;
// };

// export const HighlightText: React.FC<HighlightTextProps> = ({ text, userInput }) => {
//   const keywords = userInput.trim().toLowerCase().split(/\s+/).map(removeVietnameseTones);
//   const pattern = keywords.join('|');
//   const regex = new RegExp(`(${pattern})`, 'gi');

//   const unsignedText = removeVietnameseTones(text.toLowerCase());

//   const result: React.ReactNode[] = [];
//   let lastIndex = 0;

//   const matches = [...unsignedText.matchAll(regex)];

//   for (const match of matches) {
//     const matchIndex = match.index ?? 0;
//     const matchLength = match[0].length;

//     const before = text.slice(lastIndex, matchIndex);
//     const highlighted = text.slice(matchIndex, matchIndex + matchLength);

//     if (before) {
//       result.push(<span key={lastIndex}>{before}</span>);
//     }

//     result.push(
//       <span key={matchIndex} style={{ color: 'blue', fontWeight: 'bold' }}>
//         {highlighted}
//       </span>
//     );

//     lastIndex = matchIndex + matchLength;
//   }

//   if (lastIndex < text.length) {
//     result.push(<span key={lastIndex + 999}>{text.slice(lastIndex)}</span>);
//   }

//   return <>{result}</>;
// };

  
export default HighlightText;
  