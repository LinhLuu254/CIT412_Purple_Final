import Board from '../src/pages/Board/Board';
import RegisterPage from '../src/pages/RegisterPage/RegisterPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/Profile/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageLayout />}>
            <Route index element={<Board />} />
          </Route>
          <Route path='/profile' element={<PageLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>
          <Route path='/register' element={<PageLayout />}>
            <Route index element={<RegisterPage  />} />
          </Route>
          <Route path='/login' element={<PageLayout />}>
            <Route index element={<LoginPage  />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
