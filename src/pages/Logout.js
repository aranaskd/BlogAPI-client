import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
    const { unsetUser } = useContext(UserContext);
    const navigate = useNavigate(); // Use `useNavigate` for better navigation control

    useEffect(() => {
        unsetUser(); // Clear user data and localStorage
        navigate('/login'); // Redirect to login after logout
    }, [unsetUser, navigate]);

    return null; // No need to return anything since we're handling navigation
}
