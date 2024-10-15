import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; 
import UserContext from '../context/UserContext';

const base_url = "http://localhost:4000";

export default function Register() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate(); 

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(
            email !== "" &&
            username !== "" &&
            password !== "" &&
            confirmPassword !== "" &&
            password === confirmPassword
        );
    }, [email, username, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`${base_url}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Registered successfully") {
                setEmail('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Thank you for registering!",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    title: "Registration Failed",
                    icon: "error",
                    text: "Please check your details and try again."
                });
            }
        })
        .catch(error => {
            console.error('Error registering user:', error);
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Something went wrong. Please try again later."
            });
        });
    }

    if (user?.id) {
        return <Navigate to="/login" />;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4} className="p-4 bg-dark rounded">
                    <h1 className="text-center mb-4 text-white">Register</h1>
                    <Form onSubmit={registerUser} className="px-3">
                        
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label className="text-light">Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter Email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="userName" className="mb-3">
                            <Form.Label className="text-light">Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter Username" 
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label className="text-light">Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter Password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="confirmPassword" className="mb-3">
                            <Form.Label className="text-light">Confirm Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Confirm Password" 
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                isInvalid={confirmPassword && password !== confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                Passwords do not match.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant={isActive ? "primary" : "secondary"} type="submit" className="w-100 mt-3" disabled={!isActive}>
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
