import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import './TourGuide.css';

const TourGuideForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        experienceYears: '',
        specialization: '',
        languages: '',
        rating: '',
        isAvailable: true
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchTourGuide();
        }
        fetchUsers();
    }, [id]);

    const fetchTourGuide = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/tour-guides/${id}`);
            const guide = response.data;
            setFormData({
                userId: guide.userId,
                experienceYears: guide.experienceYears,
                specialization: guide.specialization,
                languages: guide.languages,
                rating: guide.rating,
                isAvailable: guide.isAvailable
            });
        } catch (err) {
            setError('Failed to fetch tour guide details');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const data = {
                ...formData,
                experienceYears: parseInt(formData.experienceYears),
                rating: parseFloat(formData.rating)
            };

            if (isEditMode) {
                await axios.put(`http://localhost:8080/api/tour-guides/${id}`, data);
                setSuccess('Tour guide updated successfully');
            } else {
                await axios.post('http://localhost:8080/api/tour-guides', data);
                setSuccess('Tour guide created successfully');
            }

            setTimeout(() => {
                navigate('/tour-guides');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save tour guide');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">
                        {isEditMode ? 'Edit Tour Guide' : 'Create New Tour Guide'}
                    </h2>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>User</Form.Label>
                            <Form.Select
                                name="userId"
                                value={formData.userId}
                                onChange={handleInputChange}
                                required
                                disabled={isEditMode}
                            >
                                <option value="">Select a user</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName} ({user.email})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Experience (years)</Form.Label>
                            <Form.Control
                                type="number"
                                name="experienceYears"
                                value={formData.experienceYears}
                                onChange={handleInputChange}
                                min="0"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Specialization</Form.Label>
                            <Form.Control
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleInputChange}
                                placeholder="e.g., History, Nature, Culture"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Languages</Form.Label>
                            <Form.Control
                                type="text"
                                name="languages"
                                value={formData.languages}
                                onChange={handleInputChange}
                                placeholder="e.g., English, French, Vietnamese"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rating (0-5)</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                                min="0"
                                max="5"
                                step="0.1"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                name="isAvailable"
                                label="Available for assignments"
                                checked={formData.isAvailable}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : isEditMode ? 'Update Tour Guide' : 'Create Tour Guide'}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/tour-guides')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TourGuideForm; 