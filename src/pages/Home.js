import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

const base_url = "http://localhost:4000";

export default function Home() {
  
  const { user } = useContext(UserContext); // Assuming UserContext provides user details
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
          fetchProducts(); // Refresh posts list after deletion
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
        Dive into a world of innovation, inspiration, and insights that go beyond the conventional. Here, we break down complex ideas, uncover hidden gems in technology, and explore the stories shaping our digital future. Discover new perspectives and stay ahead with content crafted to ignite curiosity and spark meaningful conversations.
      </p>
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
    </Container>
  );
}
