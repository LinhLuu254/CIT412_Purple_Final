import Board from 'src/pages/Board/Board';
import RegisterPage from 'src/pages/RegisterPage/RegisterPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from 'src/pages/LoginPage/LoginPage';
import ProfilePage from 'src/pages/ProfilePage/ProfilePage';
import PageLayout from 'src/components/PageLayout/PageLayout';
import LogoutButton from './components/LogoutButton/Logout';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageLayout />}>
            <Route index element={<Board />} />
          </Route>
          <Route path='/register' element={<PageLayout />}>
            <Route index element={<RegisterPage  />} />
          </Route>
          <Route path='/profile' element={<PageLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>
          <Route path='/login' element={<PageLayout />}>
            <Route index element={<LoginPage />} />
          </Route>
          <Route path='/logout' element={<LogoutButton />}>
              <Route index element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
