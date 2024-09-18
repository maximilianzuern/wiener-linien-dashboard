"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorMessage from "@/components/ErrorMessage";
import DefaultStopsMessage from "@/components/DefaultStopsMessage";
import StopCard from "@/components/StopCard";

function PageContent() {
  const [stationsData, setStationsData] = useState([]); // Store all stations
  const [filteredStations, setFilteredStations] = useState([]); // Store filtered stations
  const [selectedStation, setSelectedStation] = useState(""); // Selected station name
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Show/hide dropdown

  // Store real-time data
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for real-time data
  const [error, setError] = useState(null); // Error state for real-time data

  const router = useRouter(); // For navigating and updating the URL
  const searchParams = useSearchParams(); // To get current stopID from URL

  // Fetch the parsed CSV data from the server-side API route
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/fetch-stations"); // Fetch from API route

        if (!response.ok) {
          throw new Error("Failed to fetch the station data.");
        }

        const { csv } = await response.json(); // Get the parsed CSV data from the API

        setStationsData(csv); // Set the stations data
        setFilteredStations(csv); // Initially, show all stations
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };

    fetchStations();
  }, []);

  // Load stopIDs from the URL and preselect them
  useEffect(() => {
    const stopIDsFromURL = searchParams.getAll("stopID"); // Get all stopIDs from the URL
    if (stopIDsFromURL.length > 0 && stationsData.length > 0) {
      // Find and select the first matching station by stopID
      const preselectedStation = stationsData.find((station) =>
        stopIDsFromURL.includes(station.stopID)
      );
      if (preselectedStation) {
        setSelectedStation(preselectedStation.name);

        // Fetch the real-time data for the stopID
        fetchRealTimeData(stopIDsFromURL);
      }
    }
  }, [searchParams, stationsData]);

  // Fetch real-time data for the selected stopID
  const fetchRealTimeData = async (stopIDs) => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`/api/monitor?stopID=${stopIDs.join("&stopID=")}`);

      if (!response.ok) {
        throw new Error("Failed to fetch real-time data.");
      }

      const data = await response.json();
      setRealTimeData(data); // Store the fetched real-time data
    } catch (error) {
      setError(error.message); // Set the error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle search input and show/hide dropdown
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setIsDropdownVisible(true);

    // Filter stations based on the search term
    const filtered = stationsData.filter((station) =>
      station.name.toLowerCase().includes(term)
    );
    setFilteredStations(filtered);
  };

  // Handle station selection and update URL with stopID
  const handleStationSelect = (station) => {
    setSelectedStation(station.name);
    setSearchTerm(station.name); // Set search bar value to selected station
    setIsDropdownVisible(false); // Hide the dropdown after selecting

    // Append the selected stopID to the URL
    const currentStopIDs = searchParams.getAll("stopID");
    const updatedStopIDs = [...currentStopIDs, station.stopID]; // Add the new stopID

    // Update the URL with the new stopIDs (without changing the current page)
    const newURL = `?${updatedStopIDs.map((id) => `stopID=${id}`).join("&")}`;
    router.push(newURL); // Update the URL with new query params

    // Fetch the real-time data for the selected stopID
    fetchRealTimeData([station.stopID]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Vienna Public Transport</h1>

      {/* Searchable Dropdown */}
      <div className="relative w-full">
        <label htmlFor="search" className="block text-lg font-semibold mb-2">Search and Select Station:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Start typing to search for a station..."
          className="w-full p-3 border border-gray-300 rounded-lg"
          onFocus={() => setIsDropdownVisible(true)}
        />

        {isDropdownVisible && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg max-h-60 overflow-auto shadow-lg">
            {filteredStations.length > 0 ? (
              filteredStations.map((station) => (
                <li
                  key={station.stopID}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleStationSelect(station)}
                >
                  {station.name}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No stations found</li>
            )}
          </ul>
        )}
      </div>

      {/* Display real-time data using StopCard */}
      {loading ? (
        <p>Loading real-time data...</p>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : realTimeData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-8">
          {Object.entries(realTimeData).map(([title, lines]) => (
            <StopCard key={title} title={title} lines={lines} />
          ))}
        </div>
      ) : (
        <DefaultStopsMessage />
      )}

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}