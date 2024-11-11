import Editor from './Editor';
import DisplayCount from './WordCounter';
import DisplayBlocks from './DisplayBlocks';
import FullScreenToggler from './FullScreenToggler';
import ReaderControls, { DropdownSelector, ToggleDropdownMenu } from './UserInput';
import DisplayUserInputs from './DisplayUserInputs';
import BlockSelector from './BlockSelector';
import BlockGroup from './CreateBlocks';
import NextBlockTimer from './NextBlockTimer';

const minMax = {
  min: 100,
  max: 1000
}

const DisplayReader = () => {
  return (

    <div id="main-container">
      <Editor>
        <BlockSelector>
          <ReaderControls>
            <DropdownSelector minMax={minMax}>
              <BlockGroup>
                <FullScreenToggler>
                  <ToggleDropdownMenu>
                    <DisplayBlocks />
                    <DisplayCount />
                    <NextBlockTimer>
                      <DisplayUserInputs minMax={minMax} />
                    </NextBlockTimer>
                  </ToggleDropdownMenu>
                </FullScreenToggler>
              </BlockGroup>
            </DropdownSelector>
          </ReaderControls>
        </BlockSelector>
      </Editor>
    </div>
  );
};

export default DisplayReader;