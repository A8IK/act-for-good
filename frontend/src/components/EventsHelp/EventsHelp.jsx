import React, { useState, useEffect } from 'react';

const EventsHelp = () => {
    const [event, setEvent] = useState([]);

    const { createdBy } = event || {};

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


    return (
        <div>
            {
                event.map((event) => (
                    <div key={event._id} className="card bg-base-100 card-md shadow-2xl w-full">
                        <div className="card-body">
                            <h2 className="card-title">{event.title}</h2>
                            <p>{event.description}</p>
                            <p>{event.location}</p>
                            <p>{event.urgency}</p>
                            {/* <p>{userLocalTime}</p> */}
                            <p>{createdBy?.name}</p>
                            <p>Created At: {new Date(event.createdAt).toLocaleString()}</p>
                            <textarea type="text" placeholder="Comments" className="textarea textarea-info mt-4"></textarea>
                            <div className="justify-end card-actions">
                                <button className="btn btn-primary">Comment</button>
                                <button className="btn btn-primary">Join</button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default EventsHelp;
