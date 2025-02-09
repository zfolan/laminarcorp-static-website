import './App.css'
import { Idaho } from './pages/idaho/idaho';
import { LandingPage } from './pages/landing/landingPage'
import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}>
          {/* <Route index element={<div>yikes</div>}/> */}
        </Route>
        <Route path="/Idaho" element={<Idaho></Idaho>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
localStorage