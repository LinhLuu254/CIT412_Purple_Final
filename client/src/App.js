
import Board from './pages/Board/Board';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import PageLayout from './pages/PageLayout/PageLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<PageLayout />}>
                  <Route index element={<Board />} />
              </Route>
              <Route path='/register' element={<PageLayout />}>
                  <Route index element={<RegisterPage />} />
              </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
