import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import PostDetails from './components/PostDetails';
import { UserProvider } from './context/UserContext';

const base_url = "http://localhost:4000";

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });
  console.log({ user: user });

  const unsetUser = () => {
    localStorage.removeItem('token'); // Remove only token from storage
    setUser({ id: null, isAdmin: null });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(`${base_url}/users/details`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            });
          } else {
            unsetUser();
          }
        })
        .catch(err => {
          console.error('Error fetching user details:', err);
          unsetUser();
        });
    } else {
      unsetUser();
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/posts/getPost/:postId" element={<PostDetails />} />
        </Routes>

      </Router>
    </UserProvider>
  );
}

export default App;
