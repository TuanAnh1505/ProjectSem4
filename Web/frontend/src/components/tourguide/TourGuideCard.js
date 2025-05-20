import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaLanguage, FaBriefcase } from 'react-icons/fa';
import './TourGuide.css';

const TourGuideCard = ({ guide }) => {
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

    return (
        <Card className="h-100 tour-guide-card">
            <Card.Body>
                <div className="text-center mb-3">
                    <div className="guide-avatar">
                        {guide.user?.fullName?.charAt(0) || 'G'}
                    </div>
                    <Card.Title className="mt-2">{guide.user?.fullName || 'Tour Guide'}</Card.Title>
                    <div className="rating-container mb-2">
                        {renderRatingStars(guide.rating || 0)}
                        <span className="ms-2">({guide.rating?.toFixed(1) || 0})</span>
                    </div>
                </div>

                <Card.Text>
                    <div className="guide-info">
                        <div className="info-item">
                            <FaBriefcase className="me-2" />
                            <span>{guide.experienceYears} years experience</span>
                        </div>
                        <div className="info-item">
                            <FaLanguage className="me-2" />
                            <span>{guide.languages}</span>
                        </div>
                    </div>
                    <div className="specialization mt-2">
                        <Badge bg="info" className="me-1">
                            {guide.specialization}
                        </Badge>
                    </div>
                </Card.Text>

                <div className="availability-status mt-3">
                    <Badge bg={guide.isAvailable ? "success" : "danger"}>
                        {guide.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                </div>
            </Card.Body>
            <Card.Footer className="text-center">
                <Link to={`/tour-guides/${guide.guideId}`}>
                    <Button variant="outline-primary" className="w-100">
                        View Profile
                    </Button>
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default TourGuideCard; 