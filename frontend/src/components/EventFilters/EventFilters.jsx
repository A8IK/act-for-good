import React, { useState } from 'react';

const EventFilters = ({ onFilterSubmit }) => {
    const [filters, setFilters] = useState({
        urgency: "",
        date: "",
        location: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterSubmit(filters);
    }

    const handleClear = () => {
        setFilters({urgency: "", date: "", location: ""});
        onFilterSubmit({urgency: "", date: "", location: ""})
    }
    return (
        <div className="mb-6  mt-6 border-amber-500 shadow-2xl p-8 w-full">
            <h2 className="text-xl font-bold mb-4">Filter Events</h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end space-y-5 md:space-y-0 md:space-x-4 justify-center">
                <div>
                    <label htmlFor="urgency" className="block text-sm font-medium text-gray-500">
                        Urgency:
                    </label>
                    <select  type="text" id="urgency" name="urgency"
                        value={filters.urgency} onChange={handleFilterChange} placeholder="Urgency"
                        className="mt-1 block w-full p-2 border border-amber-200 rounded-md bg-gray-600 text-white">
                        <option value="">Select urgency</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-500">
                        Date:
                    </label>
                    <input type="date" id="date" name="date" value={filters.date} onChange={handleFilterChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-500">
                        Location:
                    </label>
                    <input type="text" id="location" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Enter location"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <button type="submit" className="btn btn-dash btn-info">Apply Filters</button>
                <button type="button" onClick={handleClear} className="btn btn-outline btn-error">X</button>
            </form>
        </div>
    );
};

export default EventFilters;