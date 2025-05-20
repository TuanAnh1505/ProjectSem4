import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { FaStar, FaLanguage, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import './TourGuide.css';

const TourGuideDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guide, setGuide] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchGuideDetails();
        fetchGuideAssignments();
    }, [id]);

    const fetchGuideDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/tour-guides/${id}`);
            setGuide(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch tour guide details');
            setLoading(false);
        }
    };

    const fetchGuideAssignments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/tour-guide-assignments/guide/${id}`);
            setAssignments(response.data);
        } catch (err) {
            console.error('Failed to fetch assignments:', err);
        }
    };

    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="text-warning" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStar key="half-star" className="text-warning" style={{ opacity: 0.5 }} />);
        }
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="text-muted" />);
        }

        return stars;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;
    if (error) return <div className="text-center mt-5 text-danger"><h3>{error}</h3></div>;
    if (!guide) return <div className="text-center mt-5"><h3>Tour guide not found</h3></div>;

    return (
        <Container className="mt-4">
            <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/tour-guides')}>
                ← Back to Tour Guides
            </Button>

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={3} className="text-center">
                            <div className="guide-avatar-large mb-3">
                                {guide.user?.fullName?.charAt(0) || 'G'}
                            </div>
                            <h3>{guide.user?.fullName || 'Tour Guide'}</h3>
                            <div className="rating-container mb-2">
                                {renderRatingStars(guide.rating || 0)}
                                <span className="ms-2">({guide.rating?.toFixed(1) || 0})</span>
                            </div>
                            <Badge bg={guide.isAvailable ? "success" : "danger"} className="mt-2">
                                {guide.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                        </Col>
                        <Col md={9}>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-3"
                            >
                                <Tab eventKey="profile" title="Profile">
                                    <div className="guide-details">
                                        <div className="detail-item">
                                            <FaBriefcase className="me-2" />
                                            <strong>Experience:</strong> {guide.experienceYears} years
                                        </div>
                                        <div className="detail-item">
                                            <FaLanguage className="me-2" />
                                            <strong>Languages:</strong> {guide.languages}
                                        </div>
                                        <div className="detail-item">
                                            <strong>Specialization:</strong>
                                            <Badge bg="info" className="ms-2">
                                                {guide.specialization}
                                            </Badge>
                                        </div>
                                        <div className="detail-item">
                                            <strong>Member since:</strong> {formatDate(guide.createdAt)}
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="assignments" title="Current Assignments">
                                    {assignments.length > 0 ? (
                                        <div className="assignments-list">
                                            {assignments.map(assignment => (
                                                <Card key={assignment.assignmentId} className="mb-3">
                                                    <Card.Body>
                                                        <h5>{assignment.tourName}</h5>
                                                        <div className="assignment-details">
                                                            <div>
                                                                <FaCalendarAlt className="me-2" />
                                                                {formatDate(assignment.startDate)} - {formatDate(assignment.endDate)}
                                                            </div>
                                                            <div>
                                                                <Badge bg={
                                                                    assignment.status === 'assigned' ? 'primary' :
                                                                    assignment.status === 'completed' ? 'success' :
                                                                    'danger'
                                                                }>
                                                                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                                                </Badge>
                                                            </div>
                                                            <div>
                                                                <strong>Role:</strong> {assignment.role.replace('_', ' ')}
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <Alert variant="info">
                                            No current assignments found.
                                        </Alert>
                                    )}
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TourGuideDetail; 