import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Nav } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

const base_url = "http://localhost:4000";

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    console.log({ LoginPageUSER: user });
    console.log('API Base URL:', base_url);

    function authenticate(e) {
        e.preventDefault();
        fetch(`${base_url}/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome to the platform!"
                });

                setEmail('');
                setPassword('');
            } else {
                Swal.fire({
                    title: "Authentication failed",
                    icon: "error",
                    text: "Check your login details and try again."
                });
            }
        });
    }

    const retrieveUserDetails = (token) => {
        fetch(`${base_url}/users/details`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data.user._id,
                username: data.user.username,
                isAdmin: data.user.isAdmin
            });
            navigate('/');
        });
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    useEffect(() => {
        if (user?.id) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6} className="p-4 bg-dark rounded">
                    <h1 className="text-center mb-4 text-white">Login</h1>
                    <Form onSubmit={authenticate} className="px-3">

                        <Form.Group controlId="userEmail" className="mb-3">
                            <Form.Label className="text-light">Email address</Form.Label>
                            <Form.Control 
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label className="text-light">Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant={isActive ? "primary" : "secondary"} type="submit" className="w-100 mt-3" disabled={!isActive}>
                            Log In
                        </Button>

                        <div className="text-center mt-3">
                            <Nav.Link as={NavLink} to="/register" className="text-decoration-underline text-light">
                                Create New Account
                            </Nav.Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
