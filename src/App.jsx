import './App.css'
import { HashRouter, Route, Routes, } from'react-router-dom'
import Home from './elements/Home'
import PromptEval from './elements/PromptEval'
import RagApplication from "./elements/RagApplication.jsx";
import RagEval from "./elements/RagEval.jsx";



function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prompt_eval" element={<PromptEval />} />
        <Route path="/rag_application" element={<RagApplication />} />
        <Route path="/rag_eval" element={<RagEval />} />
      </Routes>
    </HashRouter>
  );
}

export default App
















