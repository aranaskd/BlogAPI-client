import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

const base_url = "https://blogapi-aranas.onrender.com";

export default function Home() {
  
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = () => {
    fetch(`${base_url}/posts/getAllPost`)
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  const handleAddPost = () => {
    fetch(`${base_url}/posts/createPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title: newPostTitle,
        content: newPostContent
      })
    })
    .then(response => response.json())
    .then(data => {
      setShowAddPostModal(false);
      setNewPostTitle('');
      setNewPostContent('');
      Swal.fire('Success', 'Post added successfully!', 'success');
      fetchProducts(); // Refresh posts list after adding a new post
    })
    .catch(error => {
      console.error('Error adding post:', error);
      Swal.fire('Error', 'Failed to add post', 'error');
    });
  };

  const handleDeletePost = (postId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the post.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${base_url}/posts/deletePost/${postId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(response => response.json())
        .then(data => {
          Swal.fire('Deleted!', 'The post has been deleted.', 'success');
          fetchProducts();
        })
        .catch(error => {
          console.error('Error deleting post:', error);
          Swal.fire('Error', 'Failed to delete post', 'error');
        });
      }
    });
  };
  
  return (
    <Container className="py-5">
      <h1 className="text-center my-4 display-4 text-primary">Beyond the Blueprint</h1>
      <p className="text-center text-muted mb-5">
        Dive into a world of innovation, inspiration, and insights that go beyond the conventional. Here, we break down complex ideas, uncover hidden gems in technology, and explore the stories shaping our digital future.
      </p>

      {user.id && (
        <Row className="mb-4">
          <Col className="d-flex justify-content-end">
            <Button variant="success" onClick={() => setShowAddPostModal(true)}>
              Add Post
            </Button>
          </Col>
        </Row>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="justify-content-center">
          {posts.map(post => (
            <Col xs={12} key={post._id} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center font-weight-bold">
                    {post.title}
                  </Card.Title>
                  <Card.Text className="text-muted text-justify">
                    {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                  </Card.Text>
                  <div className="text-center">
                    <Link to={`/posts/getPost/${post._id}`}>
                      <Button variant="primary" className="me-2">View Post</Button>
                    </Link>
                    {user && user.isAdmin && (
                      <Button 
                        variant="outline-danger" 
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete Post
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add Post Modal */}
      <Modal show={showAddPostModal} onHide={() => setShowAddPostModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newPostTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={newPostTitle} 
                onChange={(e) => setNewPostTitle(e.target.value)} 
                placeholder="Enter post title"
              />
            </Form.Group>
            <Form.Group controlId="newPostContent" className="mt-3">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                value={newPostContent} 
                onChange={(e) => setNewPostContent(e.target.value)} 
                placeholder="Enter post content"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAddPostModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPost}>
            Submit Post
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
