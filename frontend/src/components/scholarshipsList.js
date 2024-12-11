import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getScholarships } from './services/api';
import './scholarshipsList.css';

const ScholarshipsList = () => {
    const [scholarships, setScholarships] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        departments: [],
        donors: [],
        organizations: [],
    });
    const [filters, setFilters] = useState({
        renewal_type: '',
        min_amount: '',
        max_amount: '',
        date_range_start: '',
        date_range_end: '',
        organization: '',
        department: '',
        donor: '',
        search: '',
        has_amount: 'all',
    });
    const [searchTerm, setSearchTerm] = useState("");
    // Function to handle the search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };
    const filteredScholarships = scholarships.filter((scholarship) => {
        const amount = parseFloat(scholarship.amount); // Ensure it's a number
        const minAmount = parseFloat(filters.min_amount) || 0;  // Default to 0 if not provided
        const maxAmount = parseFloat(filters.max_amount) || Infinity;  // Default to Infinity if not provided
    
        // Check if scholarship matches the search term (your existing search filter logic)
        const matchesSearchTerm =
            (scholarship.scholarship_name?.toLowerCase().includes(searchTerm) || "") ||
            (scholarship.description?.toLowerCase().includes(searchTerm) || "") ||
            (scholarship.additional_info?.toLowerCase().includes(searchTerm) || "") ||
            (scholarship.department?.toLowerCase().includes(searchTerm) || "") ||
            (scholarship.organization?.toLowerCase().includes(searchTerm) || "");
    
        // Check if the scholarship amount is within the specified range
        const matchesAmountRange = amount >= minAmount && amount <= maxAmount;
    
        // Return true if it matches both search and amount filter
        return matchesSearchTerm && matchesAmountRange;
    });
    
    const [sort, setSort] = useState('-date_created');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Format the amount as before
    const formatAmount = (amount) => {
        if (amount === "Varies") {
            return "Varies";
        }
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
            // Format the amount as currency for display purposes
            return `$${parsedAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
        return amount;  // Return the amount as it is if it's not a valid number
    };

    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('token') !== null;

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true); // Set loading state to true before API call
                const data = await getScholarships(filters, sort, currentPage); // Pass currentPage to the API call
                setScholarships(data.results); // Use `results` from the API response
                setTotalPages(Math.ceil(data.count / 10)); // Calculate total pages using API's `count`
                setFilterOptions(data.filter_options);
            } catch (error) {
                console.error('Error fetching scholarships:', error);
            } finally {
                setLoading(false); // Set loading state to false after API call
            }
        }
        fetchData();
    }, [filters, sort, currentPage]); // Re-fetch data whenever currentPage changes

    const handlePageChange = (newPage) => { // Function to handle pagination
        if (newPage > 0 && newPage <= totalPages) { // Ensure newPage is within valid range
            setCurrentPage(newPage);
        }
    };

    const handleApply = (id) => {
        // Navigate to the application page for the specific scholarship
        if (isAuthenticated) {
            navigate(`/apply/${id}`);
        } else {
            alert('You must be logged in to apply.');
        }
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    // Handle sorting change
    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    return (
        <div>
            <h1>Welcome to ScholarAid</h1>

            {/* Filters and Sorts */}
            <div>
            <div class="search-filter-container">
                <div class="search-bar-container">
                    <label htmlFor="search">Search:</label>
                    <input
                        id="search"
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="search scholarships"
                    />
                    <div class="dropdown-menu-container">
                    <label>Sort By:</label>
                        <select onChange={handleSortChange}>
                        <option value="-date_created">Recently Added</option>
                        <option value="scholarship_name">Alphabetical (A-Z)</option>
                        <option value="-scholarship_name">Alphabetical (Z-A)</option>
                        <option value="amount">Amount (Low-High)</option>
                        <option value="-amount">Amount (High-Low)</option>
                        <option value="deadline">Deadline (Earliest-Latest)</option>
                        <option value="-deadline">Deadline (Latest-Earliest)</option>
                    </select>
                    </div>
                </div>
                
                <div class="date-container">
                    <label htmlFor="date_range_start">Start Date:</label>
                    <input 
                        type="date" 
                        id="date_range_start" 
                        name="date_range_start" 
                        onChange={handleFilterChange} 
                    />

                    <label htmlFor="date_range_end">End Date:</label>
                    <input 
                        type="date" 
                        id="date_range_end" 
                        name="date_range_end" 
                        onChange={handleFilterChange} 
                    />
                </div>

                <div class="dropdown-menu-container">
                    <label>Amount (Min):</label>
                    <input 
                        type="number" 
                        name="min_amount" 
                        onChange={handleFilterChange}
                        placeholder="Min Award Amount"
                    />

                    <label>Amount (Max):</label>
                    <input 
                        type="number" 
                        name="max_amount" 
                        onChange={handleFilterChange}
                        placeholder="Max Award Amount"
                    />
                </div>
            </div>


            <div class="dropdown-menu-container">
                <label>Renewal Type:</label>
                    <select name="renewal_type" onChange={handleFilterChange}>
                        <option value="">All Types</option>
                        <option value="AR">Automatic Renewal</option>
                        <option value="APR">Application-Based Renewal</option>
                        <option value="MBS">Merit-Based Renewall</option>
                        <option value="NBR">Need-Based Renewal</option>
                        <option value="CR">Conditional Renewal</option>
                        <option value="PR">Partial Renewal</option>
                    </select>

                {/* Filter for whether the scholarship has a valid amount */}
                <label>Amount Specified:</label>
                    <select name="has_amount" onChange={handleFilterChange} value={filters.has_amount}>
                        <option value="all">All Given</option>
                        <option value="true">Yes</option>
                        <option value="false">No </option>
                    </select>
                
                <label>Available Departments:</label>
                    <select name="department" onChange={handleFilterChange} value={filters.department}>
                        <option value="">All Departments</option>
                        {filterOptions.departments.map((dept, index) => (
                            <option key={index} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>

                <label>Donor:</label>
                <select name="donor" onChange={handleFilterChange} value={filters.donor}>
                    <option value="">All Donors</option>
                    {filterOptions.donors.map((donor, index) => (
                        <option key={index} value={donor}>
                            {donor}
                        </option>
                    ))}
                </select>

                <label>Organization:</label>
                <select name="organization" onChange={handleFilterChange} value={filters.organization}>
                    <option value="">All Organizations</option>
                    {filterOptions.organizations.map((org, index) => (
                        <option key={index} value={org}>
                            {org}
                        </option>
                    ))}
                </select>


            </div>
        </div>

            {loading ? ( // New: Show a loading message while fetching data
                <p>Loading scholarships...</p>
            ) : (
                <>
                    <ul>
                        {filteredScholarships.map((scholarship) => (
                            <li key={scholarship.id}>
                                <hr />
                                <h2>
                                    <Link to={`/scholarship/${scholarship.id}`}>{scholarship.scholarship_name}</Link>
                                </h2>
                                <p><strong>Amount:</strong> {formatAmount(scholarship.amount)}</p>
                                <p><strong>Organization:</strong> {scholarship.organization}</p>
                                <p><strong>Department:</strong> {scholarship.department}</p>
                                <p><strong>Apply Between:</strong> {new Date(scholarship.open_date).toLocaleDateString()} - {new Date(scholarship.deadline).toLocaleDateString()}</p>
                                {isAuthenticated && (
                                    <button class="scholarships-list-button" onClick={() => handleApply(scholarship.id)}>Apply</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <div className="pagination"> {/* Pagination controls */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)} // Navigate to the previous page
                            disabled={currentPage === 1} // Disable if on the first page
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages} {/* Display current page info */}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)} // Navigate to the next page
                            disabled={currentPage === totalPages} // Disable if on the last page
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ScholarshipsList;