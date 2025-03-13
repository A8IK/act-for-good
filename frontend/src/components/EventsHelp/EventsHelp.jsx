import React, { useState, useEffect } from 'react';
import Comments from '../Comments/Comments';
import EventFilters from '../EventFilters/EventFilters';

const EventsHelp = () => {
    const [event, setEvent] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        date: "",
        location: "",
    })

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch('http://localhost:9000/api/events');
                const data = await response.json();

                console.log("Event data:", data);

                if (data && Array.isArray(data) && data.length > 0) {
                    setEvent(data);
                }
                else {
                    console.log("No event data found.");
                }
            }
            catch (error) {
                console.error("Failed to fetch event:", error);
                console.log("Failed to fetch event data.");
            }
        };

        fetchEvent();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const queryParams = new URLSearchParams();
                if(filters.category){
                    queryParams.append("category", filters.category);
                }
                if(filters.date){
                    queryParams.append("date", filters.date);
                }
                if(filters.location){
                    queryParams.append("location", filters.location);
                }
    
                const response = await fetch(
                    `http://localhost:9000/api/events/filter?${queryParams.toString()}`
                )
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
    
                const data = await response.json();
                setEvent(data);
            }
            catch (error){
                console.log("Error fetching filters events: ", error);
            }
        }

        fetchEvents();

    },[filters]);
    
    const handleFilterSubmit = (newFilters) => {
        setFilters(newFilters);
    }

    return (
        <div>
            <EventFilters onFilterSubmit={handleFilterSubmit}></EventFilters>
            {
                event.map((event) => (
                    <div key={event._id} className="card bg-base-100 card-md shadow-2xl w-full m-5">
                        <div className="card-body">
                            <h2 className="card-title">{event.title}</h2>
                            <p>{event.description}</p>
                            <span>location: <div className="badge badge-outline badge-accent ml-1.5">{event.location}</div></span>
                            <p>Urgency: <div className="badge badge-outline badge-info ml-1.5"> {event.urgency}</div></p>
                            <span>Name: <div className="badge badge-soft badge-success ml-1.5">{event.createdBy?.name || "unknown"}</div></span>
                            <div className='flex justify-between'>
                                <span>Event Date: <div className="badge badge-soft badge-error">{new Date(event.eventDate).toLocaleDateString("en-US")}</div></span>
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
        </div>
    );
};

export default EventsHelp;
