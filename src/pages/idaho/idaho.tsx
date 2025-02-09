import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import '../../assets/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useIdaho } from './useIdaho';

const BlogLayout = () => {
    const {blogPosts} = useIdaho();
    
  return (
    <Container className="py-5">
      {/* Header Section */}
      <header className="mb-5">
        <h1 className="display-4 mb-4">IDAHO</h1>
        
        {/* Search and Filter Bar */}
        <Row className="g-3">
          <Col md={8}>
            <InputGroup>
              <Form.Control
                placeholder="Search articles..."
                aria-label="Search articles"
              />
              <Button variant="outline-secondary">Search</Button>
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select aria-label="Filter by category">
              <option>All Categories</option>
              <option>Development</option>
              <option>JavaScript</option>
              <option>CSS</option>
            </Form.Select>
          </Col>
        </Row>
      </header>

      {/* Blog Posts Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {blogPosts.map((post, idx) => (
          <Col key={idx}>
            <Card className="h-100 shadow-sm hover-shadow">
              <Card.Img 
                variant="top" 
                src={post.image} 
                alt={post.title}
                className="bg-light"
                style={{ 
                    width: '40px', 
                    height: '40px',
                    marginRight: '10px'
                  }}
              />
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge bg="primary" className="px-3 py-2">
                    {post.category}
                  </Badge>
                  <small className="text-muted">{post.readTime}</small>
                </div>
                <Card.Title className="h5 mb-3">{post.title}</Card.Title>
                <Card.Text className="text-muted">
                  {post.excerpt}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle bg-secondary"
                      style={{ 
                        width: '40px', 
                        height: '40px',
                        marginRight: '10px'
                      }}
                    />
                    <div>
                      <small className="text-muted d-block">Written by</small>
                      <span className="fw-medium">{post.author}</span>
                    </div>
                  </div>
                  <small className="text-muted">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </small>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-5">
        <Button variant="outline-primary" className="mx-1">Previous</Button>
        <Button variant="primary" className="mx-1">1</Button>
        <Button variant="outline-primary" className="mx-1">2</Button>
        <Button variant="outline-primary" className="mx-1">3</Button>
        <Button variant="outline-primary" className="mx-1">Next</Button>
      </div>
    </Container>
  );
};



export const Idaho = () => {
    return (
            <BlogLayout></BlogLayout>
        )
    }