import React, { useState, useEffect } from 'react';
import Comments from '../Comments/Comments';
import EventFilters from '../EventFilters/EventFilters';
import { useLoaderData } from 'react-router-dom';

const EventsHelp = () => {
    const initialEvents = useLoaderData();
    const [event, setEvent] = useState(initialEvents?.events || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventPerPage] = useState(7);
    const [totalPages, setTotalPages] = useState(initialEvents?.totalPages || 1);
    const [filters, setFilters] = useState({
        urgency: "",
        date: "",
        location: "",
    })

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page: currentPage,
                    limit: eventPerPage,
                });

                if (filters.urgency) {
                    queryParams.append("urgency", filters.urgency);
                }
                if (filters.date) {
                    queryParams.append("date", filters.date);
                }
                if (filters.location) {
                    queryParams.append("location", filters.location);
                }

                const response = await fetch(
                    `http://localhost:9000/api/events/filter?${queryParams.toString()}`
                )
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                const data = await response.json();
                console.log("Fetched events data:", data);
            
                setEvent(data.events || []);
                setTotalPages(data.totalPages || 1);
            }
            catch (error) {
                console.log("Error fetching filters events: ", error);
            }
        }

        fetchEvents();

    }, [currentPage, filters, eventPerPage]);

    const handleFilterSubmit = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    }

    return (
        <div>
            <EventFilters onFilterSubmit={handleFilterSubmit}></EventFilters>
            { 
                event.map((event) => (
                    <div key={event._id} className="card bg-base-100 card-md shadow-2xl w-full m-5">
                        <div className="card-body">
                            <h2 className="card-title">{event.title}</h2>
                            <span><strong>Details:</strong> <p>{event.description}</p></span>
                            <span className='mt-4'>location: <div className="badge badge-outline badge-accent ml-1.5">{event.location}</div></span>
                            <p className='mt-1'>Urgency: <div className="badge badge-outline badge-info ml-1.5"> {event.urgency}</div></p>
                            <span className='mt-1'>Name: <div className="badge badge-soft badge-success ml-1.5">{event.createdBy?.name || "unknown"}</div></span>
                            <div className='flex justify-between mt-1 mb-2'>
                                <span>Event Date: <div className="badge badge-soft badge-error">{event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-US") : "N/A"}</div></span>
                                <span>Created At: <div className="badge badge-soft badge-success ml-1.5">{new Date(event.createdAt).toLocaleString()}</div></span>
                            </div>
                            <Comments eventId={event._id}></Comments>
                            <div className="card-actions flex justify-end">
                                {/* <button className="btn btn-primary">Comment</button> */}
                                <button className="btn btn-accent">Join Event</button>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className="flex justify-center mt-6">
                <button
                    className="btn btn-square join-item"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    «
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`join-item btn btn-square ${currentPage === page ? "bg-amber-500 text-white" : "bg-gray-300 text-black"}`}
                        onClick={() => handlePageChange(page)}>
                        {page}
                    </button>
                ))}

                <button
                    className="btn btn-square join-item"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    »
                </button>
            </div>
        </div>
    );
};

export default EventsHelp;
