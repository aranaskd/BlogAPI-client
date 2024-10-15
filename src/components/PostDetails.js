import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Modal, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const base_url = "https://blogapi-aranas.onrender.com";

export default function PostDetails() {
    const { user } = useContext(UserContext);
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [updateCommentId, setUpdateCommentId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = () => {
        fetch(`${base_url}/posts/getPost/${postId}`)
            .then(response => response.json())
            .then(data => setPost(data))
            .catch(error => {
                console.error('Error fetching post details:', error);
                Swal.fire('Error', 'Could not load post details', 'error');
            });
    };

    const handleAddComment = () => {
        fetch(`${base_url}/posts/addComment/${postId}/comments`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                comment: commentText
            })
        })
        .then(response => response.json())
        .then(data => {
            setCommentText("");
            setShowModal(false);
            Swal.fire('Success', 'Comment added successfully!', 'success');
            fetchPost(); 
        })
        .catch(error => {
            console.error('Error adding comment:', error);
            Swal.fire('Error', 'Failed to add comment', 'error');
        });
    };

    const handleUpdateComment = (commentId) => {
        const commentToEdit = post.comments.find(comment => comment._id === commentId);
        setCommentText(commentToEdit.comment);
        setUpdateCommentId(commentId);
        setShowUpdateModal(true);
    };

    const handleSaveUpdatedComment = () => {
        fetch(`${base_url}/posts/updateComment/${postId}/comments/${updateCommentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                comment: commentText
            })
        })
        .then(response => response.json())
        .then(data => {
            setCommentText("");
            setUpdateCommentId(null);
            setShowUpdateModal(false);
            Swal.fire('Success', 'Comment updated successfully!', 'success');
            fetchPost();
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            Swal.fire('Error', 'Failed to update comment', 'error');
        });
    };

    const handleDeleteComment = (commentId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${base_url}/posts/deleteComment/${postId}/comments/${commentId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then(response => response.json())
                .then(data => {
                    Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
                    fetchPost();
                })
                .catch(error => {
                    console.error('Error deleting comment:', error);
                    Swal.fire('Error', 'Failed to delete comment', 'error');
                });
            }
        });
    };

    if (!post) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading post details...</p>
            </div>
        );
    }

    return (
        <Container className="py-5">
            <Card className="shadow-sm">
                <Card.Body>
                    <h1 className="text-center mb-4">{post.title}</h1>
                    <Card.Subtitle className="mb-2 text-muted text-center">by {post.author.name}</Card.Subtitle>
                    <Card.Text className="mt-4">{post.content}</Card.Text>
                    
                    {post.comments && post.comments.length > 0 ? (
                        <div className="mt-4">
                            <h5>Comments:</h5>
                            <ul className="list-unstyled">
                                {post.comments.map((comment, index) => (
                                    <li key={index} className="border-bottom py-2">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>{comment.username}:</strong> {comment.comment}
                                            </div>
                                        </div>
                        
                                        {(user && (comment.userId === user.id || user.isAdmin)) && (
                                            <div className="d-flex justify-content-end mt-2">
                                                {comment.userId === user.id && (
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        onClick={() => handleUpdateComment(comment._id)}
                                                        className="me-2"
                                                    >
                                                        Update
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    
                    ) : (
                        <p className="text-muted mt-4">No comments yet.</p>
                    )}
                    
                    <div className="text-center mt-4">
                        {user && user.id ? (
                            <Button variant="primary" onClick={() => setShowModal(true)} className="me-2">
                                Add Comment
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={() => navigate('/login')} className="me-2">
                                Login to Add Comment
                            </Button>
                        )}
                        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Add Comment Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="commentText">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)} 
                                placeholder="Enter your comment here..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddComment} className="ms-2">
                        Submit Comment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Comment Modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="updateCommentText">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowUpdateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveUpdatedComment} className="ms-2">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
