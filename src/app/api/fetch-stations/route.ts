import Papa from "papaparse";
import { NextResponse } from "next/server";

// Server-side API route for fetching and parsing the CSV file
export async function GET() {
  try {
    // Fetch the CSV data from the external server
    const response = await fetch("https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-haltepunkte.csv");

    if (!response.ok) {
      throw new Error("Failed to fetch the CSV file.");
    }

    const csvText = await response.text();

    // Parse the CSV using PapaParse
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data.map((station) => ({
            stopID: station["StopID"],        // Stop ID
            diva: station["DIVA"],            // DIVA
            name: station["StopText"],        // Stop name
            municipality: station["Municipality"], // Municipality
            municipalityID: station["MunicipalityID"], // Municipality ID
            lat: station["Latitude"],         // Latitude
            lon: station["Longitude"],        // Longitude
          }));

          resolve(NextResponse.json({ csv: data }));  // Send the parsed data to the client
        },
        error: (err) => {
          reject(NextResponse.json({ error: err.message }, { status: 500 }));
        },
      });
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}