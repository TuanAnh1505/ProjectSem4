import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import '../../styles/event/EventIndex.css';
import '../../styles/destination/DestinationIndex.css';

const MediaPreview = ({ filePath, onClick }) => {
    const isVideo = filePath.match(/\.(mp4|mov)$/i);
    return isVideo ? (
        <video
            src={`http://localhost:8080${filePath}`}
            className="media-preview"
            onClick={onClick}
        />
    ) : (
        <img
            src={`http://localhost:8080${filePath}`}
            alt="Preview"
            className="media-preview"
            onClick={onClick}
        />
    );
};

const MediaModal = ({ media, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % media.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const currentMedia = media[currentIndex];
    const isVideo = currentMedia?.match(/\.(mp4|mov)$/i);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                {isVideo ? (
                    <video
                        src={`http://localhost:8080${currentMedia}`}
                        className="modal-media"
                        controls
                        autoPlay
                    />
                ) : (
                    <img
                        src={`http://localhost:8080${currentMedia}`}
                        alt={`Media ${currentIndex + 1}`}
                        className="modal-media"
                    />
                )}
                {media.length > 1 && (
                    <>
                        <button className="modal-nav-button prev" onClick={handlePrev}>‹</button>
                        <button className="modal-nav-button next" onClick={handleNext}>›</button>
                    </>
                )}
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div className="pagination">
            <button 
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &laquo;
            </button>
            
            {pages.map(page => (
                <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            
            <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                &raquo;
            </button>
        </div>
    );
};

const EventIndex = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filterMonth, setFilterMonth] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

    useEffect(() => {
        loadEvents();
        fetchEventStatuses();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, filterMonth, filterStatus, filterPrice, showAdvancedFilter]);

    const loadEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/events', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    const fetchEventStatuses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/events/event-statuses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatusOptions(response.data);
        } catch (error) {
            console.error('Error fetching event statuses:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        if (window.confirm(t('confirm_delete_event'))) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/events/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                loadEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };

    const filterEvents = () => {
        let filtered = [...events];

        if (!showAdvancedFilter) {
            // Basic filters (month and status)
            if (filterMonth !== 'all') {
                filtered = filtered.filter(event => {
                    const eventMonth = new Date(event.startDate).getMonth();
                    return eventMonth === parseInt(filterMonth);
                });
            }

            if (filterStatus !== 'all') {
                filtered = filtered.filter(event => 
                    event.statusName === filterStatus
                );
            }
        } else {
            // Price filter
            if (filterPrice.min !== '') {
                filtered = filtered.filter(event => 
                    event.ticketPrice >= parseFloat(filterPrice.min)
                );
            }
            if (filterPrice.max !== '') {
                filtered = filtered.filter(event => 
                    event.ticketPrice <= parseFloat(filterPrice.max)
                );
            }
        }

        setFilteredEvents(filtered);
        setCurrentPage(1);
    };

    const toggleFilters = () => {
        setShowAdvancedFilter(!showAdvancedFilter);
        // Reset filters when switching
        setFilterMonth('all');
        setFilterStatus('all');
        setFilterPrice({ min: '', max: '' });
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    return (
        <div className="container">
            <div className="header">
                <h2>{t("event_management")}</h2>
                <Link to="/admin/event/add" className="create-btn">
                    {t("create")}
                </Link>
            </div>

            <div className="filters">
                {!showAdvancedFilter ? (
                    // Basic filters
                    <>
                        <div className="filter-group">
                            <label>{t("filter_by_month")}:</label>
                            <select 
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="form-select"
                            >
                                <option value="all">{t("all_months")}</option>
                                <option value="0">{t("january")}</option>
                                <option value="1">{t("february")}</option>
                                <option value="2">{t("march")}</option>
                                <option value="3">{t("april")}</option>
                                <option value="4">{t("may")}</option>
                                <option value="5">{t("june")}</option>
                                <option value="6">{t("july")}</option>
                                <option value="7">{t("august")}</option>
                                <option value="8">{t("september")}</option>
                                <option value="9">{t("october")}</option>
                                <option value="10">{t("november")}</option>
                                <option value="11">{t("december")}</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>{t("filter_by_status")}:</label>
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="form-select"
                            >
                                <option value="all">{t("all_statuses")}</option>
                                {statusOptions.map(status => (
                                    <option key={status.eventStatusId} value={status.statusName}>
                                        {status.statusName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                ) : (
                    // Price filter
                    <div className="filter-group price-filter">
                        <label>{t("filter_by_price")}:</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder={t("min_price")}
                                value={filterPrice.min}
                                onChange={(e) => setFilterPrice(prev => ({ ...prev, min: e.target.value }))}
                                className="form-control"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder={t("max_price")}
                                value={filterPrice.max}
                                onChange={(e) => setFilterPrice(prev => ({ ...prev, max: e.target.value }))}
                                className="form-control"
                            />
                        </div>
                    </div>
                )}

                <button 
                    className="toggle-filter-btn"
                    onClick={toggleFilters}
                    title={showAdvancedFilter ? t("show_basic_filters") : t("show_price_filter")}
                >
                    {showAdvancedFilter ? '×' : '+'}
                </button>

                <div className="total-count">
                    {t("total_events")}: {filteredEvents.length}
                </div>
            </div>

            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>{t("id")}</th>
                        <th>{t("file_paths")}</th>
                        <th>{t("name")}</th>
                        <th>{t("description")}</th>
                        <th>{t("ticket_price")}</th>
                        <th>{t("location")}</th>
                        <th>{t("status")}</th>
                        <th>{t("start_date")}</th>
                        <th>{t("end_date")}</th>
                        <th>{t("actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(event => (
                        <tr key={event.eventId}>
                            <td>{event.eventId}</td>
                            <td>
                                {event.filePaths.length > 0 && (
                                    <div className="preview-container">
                                        <MediaPreview
                                            filePath={event.filePaths[0]}
                                            onClick={() => setSelectedMedia(event.filePaths)}
                                        />
                                        {event.filePaths.length > 1 && (
                                            <span className="preview-count">
                                                {event.filePaths.length - 1}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td>{event.name}</td>
                            <td>{event.description}</td>
                            <td>{event.ticketPrice}</td>
                            <td>{event.location}</td>
                            <td>{event.statusName}</td>
                            <td>{new Date(event.startDate).toLocaleString()}</td>
                            <td>{new Date(event.endDate).toLocaleString()}</td>
                            
                            <td>
                                <Link
                                    to={`/admin/event/detail/${event.eventId}`}
                                    className="action-link"
                                >
                                     🔍  
                                </Link>
                                <Link
                                    to={`/admin/event/edit/${event.eventId}`}
                                   className="action-link"
                                >
                                    ✏️
                                </Link>
                                <button className="delete-button"
                                    onClick={() => deleteEvent(event.eventId)}
                                    
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            
            {selectedMedia && (
                <MediaModal
                    media={selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                />
            )}
        </div>
    );
};

export default EventIndex;
