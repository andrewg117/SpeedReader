import React from 'react';
import BlockSelector from './BlockSelector';
import { useToggleFullScreen, useIsFull, FullIcon } from './FullScreenToggler';
import { useBlockGroup, useBlockText } from './CreateBlocks';

const DisplayBlocks = () => {
  const blockGroup = useBlockGroup();
  const blockText = useBlockText();
  const toggleFullScreen = useToggleFullScreen();
  const { fullBlock, fullSelector } = useIsFull();

  return (
    <BlockSelector>
      <section
        id="preview"
        className={fullSelector ? "fullScreen" : "normal"}
      >
        {fullBlock ? null : blockGroup}
        <FullIcon iconID="fullPreview" toggle={toggleFullScreen} />
      </section>

      <section
        id="block-view"
        className={fullBlock ? "fullScreen" : "normal"}
      >
        {fullSelector ? null : <p>{ blockText}</p>}
        <FullIcon iconID="fullBlock" toggle={toggleFullScreen} />
      </section>
    </BlockSelector>
  );
}

export default DisplayBlocks;