import './App.css'
import { HashRouter, Route, Routes, } from'react-router-dom'
import Home from './elements/Home'
import PromptEval from './elements/PromptEval'


function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prompt-eval" element={<PromptEval />} />
      </Routes>
    </HashRouter>
  );
}

export default App
















