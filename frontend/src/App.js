
import TaskBoards from './TaskBoards';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<TaskBoards/>}/>
     
    </Routes>
    </BrowserRouter>
  );
}

export default App;
