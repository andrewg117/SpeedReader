import React, { useState, useEffect, useContext } from 'react';
import { useText } from './Editor';
import { useSelectedBlock, useChangeBlock } from './BlockSelector';
import { useSelectValue } from './UserInput';

const Block = (props) => {
  const selectBlockOnClick = () => {
    props.selectBlockOnClick(props.id);
  };

  return (
    <div
      id="textBlock"
      className={props.isSelected ? "isActive" : ""}
      onClick={selectBlockOnClick}
    >
      {props.text}
    </div>
  );
};

const ConvertTextToBlocks = (selectedID, editorText, wordsPerBlock, selectBlock) => {
  const splitTextArr = editorText.split(/\s/);
  let joinedTextArr = [];

  for (let i = 0; i < splitTextArr.length; i += wordsPerBlock) {
    if (splitTextArr[i] !== "") {
      joinedTextArr.push(splitTextArr.slice(i, i + wordsPerBlock).join(" "));
    }
  }

  const blocksArr = joinedTextArr.map((text, index) => {
    return (
      <Block
        key={index}
        id={index}
        text={text}
        selectBlockOnClick={selectBlock}
        isSelected={selectedID === index ? true : false}
      />
    );
  });
  return (blocksArr);
}

const BlockGroupContext = React.createContext();
const BlockTextContext = React.createContext();

export const useBlockGroup = () => {
  return useContext(BlockGroupContext);
}
export const useBlockText = () => {
  return useContext(BlockTextContext);
}

const BlockGroup = ({ children }) => {
  const text = useText();
  const selectedID = useSelectedBlock();
  const selectBlock = useChangeBlock();
  const { wordsPerBlock } = useSelectValue();

  const [blockGroup, updateBlocks] = useState(() => {
    return ConvertTextToBlocks(selectedID, text, wordsPerBlock, selectBlock);
  });
  const [blockText, changeText] = useState(() => {
    return blockGroup[selectedID].props.text;
  });

  useEffect(() => {
    updateBlocks(ConvertTextToBlocks(selectedID, text, wordsPerBlock, selectBlock));
  }, [text, selectedID, selectBlock, wordsPerBlock]);

  useEffect(() => {
    changeText(blockGroup[selectedID].props.text)
  }, [selectedID, blockGroup]);

  return (
    <BlockGroupContext.Provider value={blockGroup}>
      <BlockTextContext.Provider value={blockText}>
        {children}
      </BlockTextContext.Provider>
    </BlockGroupContext.Provider>
  );
}



/* export const SelectedBlock = ({ children }) => {
  const blockGroup = useBlockGroup();
  const selectedID = useSelectedBlock();

  const [blockText, changeText] = useState(() => {
    return blockGroup[selectedID].props.text;
  });

  useEffect(() => {
    changeText(blockGroup[selectedID].props.text)
  }, [selectedID, blockGroup]);

  return (
    <BlockTextContext.Provider value={blockText}>
      {children}
    </BlockTextContext.Provider>
  );
} */

export default BlockGroup;
