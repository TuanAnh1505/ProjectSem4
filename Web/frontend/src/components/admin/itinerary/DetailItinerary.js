import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
}

const DetailItinerary = () => {
    const { itineraryId } = useParams();
    const navigate = useNavigate();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItinerary();
        }, [itineraryId]);

    const fetchItinerary = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/itineraries/${itineraryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setItinerary(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching itinerary:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mt-4">Loading...</div>;
    }

    if (!itinerary) {
        return <div className="container mt-4">Itinerary not found</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Itinerary Details</h2>
                <div>
                    <button 
                        className="btn btn-warning me-2"
                            onClick={() => navigate(`/admin/itineraries/edit/${itineraryId}`)}
                    >
                        Edit
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => navigate('/admin/itineraries')}
                    >
                        Back to List
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h5 className="card-title">Basic Information</h5>
                            <p><strong>ID:</strong> {itinerary.itineraryId}</p>
                            <p><strong>Schedule ID:</strong> {itinerary.scheduleId}</p>
                           
                            <p><strong>Title:</strong> {itinerary.title}</p>
                        </div>
                        <div className="col-md-6">
                            <h5 className="card-title">Timing</h5>
                            <p><strong>Start Time:</strong> {formatTime(itinerary.startTime)}</p>
                            <p><strong>End Time:</strong> {formatTime(itinerary.endTime)}</p>
                            
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12">
                            <h5 className="card-title">Description</h5>
                            <p>{itinerary.description}</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <p><strong>Type:</strong> {itinerary.type}</p>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailItinerary;