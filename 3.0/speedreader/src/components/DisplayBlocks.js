import React from 'react';
import BlockSelector from './BlockSelector';
import { useToggleFullScreen, useIsFull, FullIcon } from './FullScreenToggler';
import { SelectedBlock, useBlockGroup, useBlockText } from './CreateBlocks';

const DisplayBlocks = () => {
  const blockGroup = useBlockGroup();
  const blockText = useBlockText();
  const toggleFullScreen = useToggleFullScreen();
  const { fullBlock, fullSelector } = useIsFull();

  return (
    <BlockSelector>
      <SelectedBlock>
        <section
          id="preview"
          className={fullSelector ? "fullScreen" : "normal"}
        >
          {blockGroup}
          <FullIcon iconID="fullPreview" toggle={toggleFullScreen} />
        </section>

        <section
          id="block-view"
          className={fullBlock ? "fullScreen" : "normal"}
        >
          {<p>{blockText}</p>}
          <FullIcon iconID="fullBlock" toggle={toggleFullScreen} />
        </section>
      </SelectedBlock>
    </BlockSelector>
  );
}

export default DisplayBlocks;