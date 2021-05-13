import Editor from './Editor';
import DisplayCount from './WordCounter';
import BlockSelector from './BlockSelector';
import DisplayBlocks from './DisplayBlocks';


const DisplayReader = () => {
  return (
    
    <div id="main-container">
      <Editor>
        <BlockSelector>
          <DisplayBlocks />
        </BlockSelector>
        <DisplayCount />
      </Editor>
    </div>
  );
};

export default DisplayReader;