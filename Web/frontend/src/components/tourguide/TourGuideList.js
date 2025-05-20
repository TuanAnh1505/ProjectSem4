import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, InputGroup, Button, Card } from 'react-bootstrap';
import TourGuideCard from './TourGuideCard';
import './TourGuide.css';

const TourGuideList = () => {
    const [tourGuides, setTourGuides] = useState([]);
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [searchParams, setSearchParams] = useState({
        minRating: '',
        minExperience: '',
        specialization: '',
        language: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTourGuides();
    }, []);

    const fetchTourGuides = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/tour-guides');
            setTourGuides(response.data);
            setFilteredGuides(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch tour guides');
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            let filtered = [...tourGuides];

            if (searchParams.minRating) {
                const response = await axios.get(`http://localhost:8080/api/tour-guides/search/rating?minRating=${searchParams.minRating}`);
                filtered = response.data;
            }

            if (searchParams.minExperience) {
                const response = await axios.get(`http://localhost:8080/api/tour-guides/search/experience?minExperience=${searchParams.minExperience}`);
                filtered = filtered.filter(guide => response.data.some(g => g.guideId === guide.guideId));
            }

            if (searchParams.specialization) {
                const response = await axios.get(`http://localhost:8080/api/tour-guides/search/specialization?specialization=${searchParams.specialization}`);
                filtered = filtered.filter(guide => response.data.some(g => g.guideId === guide.guideId));
            }

            if (searchParams.language) {
                const response = await axios.get(`http://localhost:8080/api/tour-guides/search/language?language=${searchParams.language}`);
                filtered = filtered.filter(guide => response.data.some(g => g.guideId === guide.guideId));
            }

            setFilteredGuides(filtered);
        } catch (err) {
            setError('Failed to apply filters');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReset = () => {
        setSearchParams({
            minRating: '',
            minExperience: '',
            specialization: '',
            language: ''
        });
        setFilteredGuides(tourGuides);
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;
    if (error) return <div className="text-center mt-5 text-danger"><h3>{error}</h3></div>;

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Our Tour Guides</h2>
            
            {/* Search Filters */}
            <Card className="mb-4 p-3">
                <Form>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Minimum Rating</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="minRating"
                                    value={searchParams.minRating}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    placeholder="0-5"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Minimum Experience (years)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="minExperience"
                                    value={searchParams.minExperience}
                                    onChange={handleInputChange}
                                    min="0"
                                    placeholder="Years"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Specialization</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="specialization"
                                    value={searchParams.specialization}
                                    onChange={handleInputChange}
                                    placeholder="e.g., History, Nature"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Language</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="language"
                                    value={searchParams.language}
                                    onChange={handleInputChange}
                                    placeholder="e.g., English, French"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col className="text-center">
                            <Button variant="primary" onClick={handleSearch} className="me-2">
                                Search
                            </Button>
                            <Button variant="secondary" onClick={handleReset}>
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* Tour Guide List */}
            <Row>
                {filteredGuides.map(guide => (
                    <Col key={guide.guideId} md={4} className="mb-4">
                        <TourGuideCard guide={guide} />
                    </Col>
                ))}
                {filteredGuides.length === 0 && (
                    <Col className="text-center">
                        <h4>No tour guides found matching your criteria</h4>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default TourGuideList; 