import React, { useState, useEffect, useContext } from 'react';
import { useText } from './Editor';
import { useSelectedBlock, useChangeBlock } from './BlockSelector';
import FullScreenToggler, { useToggleFullScreen, useIsFull, FullIcon } from './FullScreenToggler';

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

const useBlockGroup = () => {
  return useContext(BlockGroupContext);
}

const BlockGroup = ({children}) => {
  const text = useText();
  const selectedID = useSelectedBlock();
  const selectBlock = useChangeBlock();
  const toggleFullScreen = useToggleFullScreen();
  const { fullSelector } = useIsFull();

  const [blockGroup, updateBlocks] = useState(() => {
    return ConvertTextToBlocks(selectedID, text, 1, selectBlock);
  });

  useEffect(() => {
    updateBlocks(ConvertTextToBlocks(selectedID, text, 1, selectBlock));
  }, [text, selectedID, selectBlock]);

  return (
    <BlockGroupContext.Provider value={blockGroup}>
      <section
        id="preview"
      className={fullSelector ? "fullScreen" : "normal"}
      >
        {blockGroup}
        <FullIcon iconID="fullPreview" toggle={toggleFullScreen} />
      </section>
      {children}
    </BlockGroupContext.Provider>
  );
}

const SelectedBlockView = () => {
  const blockGroup = useBlockGroup();
  const selectedID = useSelectedBlock();
  const toggleFullScreen = useToggleFullScreen();
  const { fullBlock } = useIsFull();

  const [ blockText, changeText ] = useState(() => {
    return blockGroup[selectedID].props.text;
  });
  
  useEffect(() => {
    changeText(blockGroup[selectedID].props.text)
  }, [selectedID, blockGroup]);

  return (
    <section
      id="block-view"
    className={fullBlock ? "fullScreen" : "normal"}
    >
      {<p>{blockText}</p>}
      <FullIcon iconID="fullBlock" toggle={toggleFullScreen} />
    </section>
  );
}

const DisplayBlocks = () => {
  return (
    <FullScreenToggler>
      <BlockGroup>
        <SelectedBlockView />
      </BlockGroup>
    </FullScreenToggler>
  );
}

export default DisplayBlocks;