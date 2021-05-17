import Editor from './Editor';
import DisplayCount from './WordCounter';
import DisplayBlocks from './DisplayBlocks';
import FullScreenToggler from './FullScreenToggler';
import ReaderControls, { DropdownSelector, ToggleDropdownMenu } from './UserInput';
import DisplayUserInputs from './DisplayUserInputs';
import BlockSelector from './BlockSelector';
import BlockGroup from './CreateBlocks';


const DisplayReader = () => {
  return (

    <div id="main-container">
      <Editor>
        <BlockSelector>
          <DropdownSelector>
            <BlockGroup>
              <ReaderControls>
                <FullScreenToggler>
                  <ToggleDropdownMenu>
                    <DisplayBlocks />
                    <DisplayCount />
                    <DisplayUserInputs />
                  </ToggleDropdownMenu>
                </FullScreenToggler>
              </ReaderControls>
            </BlockGroup>
          </DropdownSelector>
        </BlockSelector>
      </Editor>
    </div>
  );
};

export default DisplayReader;