import Auth from './components/Auth'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './components/Home'
import Test from './components/Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Auth />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
