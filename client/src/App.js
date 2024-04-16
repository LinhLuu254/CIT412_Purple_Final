import Board from 'src/pages/Board/Board';
import RegisterPage from 'src/pages/RegisterPage/RegisterPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from 'src/pages/LoginPage/LoginPage';
import ProfilePage from 'src/pages/Profile/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Board />} />
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
