import Editor from './Editor';
import DisplayCount from './WordCounter';
import BlockSelector from './BlockSelector';
import DisplayBlocks from './DisplayBlocks';
import DisplayUserInputs from './UserInput';
import FullScreenToggler from './FullScreenToggler';
import { DropdownSelector, ReaderControls } from './UserInput';


const DisplayReader = () => {
  return (

    <div id="main-container">
      <Editor>
        <BlockSelector>
          <ReaderControls>
            <DropdownSelector>
              <FullScreenToggler>
                <DisplayBlocks />
                <DisplayUserInputs />
              </FullScreenToggler>
            </DropdownSelector>
          </ReaderControls>
        </BlockSelector>
        <DisplayCount />
      </Editor>
    </div>
  );
};

export default DisplayReader;