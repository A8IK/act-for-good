import React, { useState } from 'react';

const CreateEvent = () => {
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        urgency: "Low",
        location: "",
    });

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!eventData.title || !eventData.description || !eventData.urgency || !eventData.location) {
            alert("All fields are required");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("You must be logged in to create event.")
                return;
            }
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id;

            const userLocalTime = new Date().toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });

            const response = await fetch("http://localhost:9000/api/events/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ...eventData, createdBy: userId, userLocalTime})
            })

            console.log("Raw Response:", response); //debugging

            if (!response.ok) {
                const data = await response.json();
                console.error("Error Response Data:", data);
                throw new Error("Failed to create help request")
            };
            alert("Event created successfully!");
            setEventData({ title: "", description: "", urgency: "Low", location:"" });
        }
        catch (error) {
            console.error(error);
            alert("Error creating help request");
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen'>
            <form onSubmit={handleSubmit} className="fieldset w-full max-w-md bg-base-200 border border-base-300 p-6 rounded-box shadow-lg">
                <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                    <legend className="fieldset-legend text-xl">Spread Hands</legend>

                    <label className="fieldset-label">Title</label>
                    <input type="text" name="title" className="input" placeholder="Event title" value={eventData.title} onChange={handleChange} />

                    <label className="fieldset-label">Description</label>
                    <input type="text" name="description" className="input h-25" placeholder="Write your event description." value={eventData.description} onChange={handleChange} />

                    <label className="fieldset-label">Location</label>
                    <input type="text" name="location" className="input" placeholder="Event location" value={eventData.location} onChange={handleChange} />

                    <label className="fieldset-label mt-4 block">Urgency</label>
                    <select name="urgency" className="select" value={eventData.urgency} onChange={handleChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button type="submit" className="btn btn-soft btn-success mt-3">Create Event</button>
                </fieldset>
            </form>
        </div>
    );
};

export default CreateEvent;