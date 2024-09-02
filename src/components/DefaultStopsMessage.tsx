const DefaultStopsMessage = () => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
    <p className="font-bold">Using default stops</p>
    <p>To see departures for specific stops:</p>
    <ol className="list-decimal list-inside mt-1">
      <li>
        Find valid stop IDs{" "}
        <a
          href="https://till.mabe.at/rbl/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          here
        </a>
      </li>
      <li>
        Add to the web address: <span className="font-mono bg-yellow-200 px-1">/?stopID=4111</span>
      </li>
      <li>
        For multiple stops, use:{" "}
        <span className="font-mono bg-yellow-200 px-1">/?stopID=4111&amp;stopID=4118</span>
      </li>
    </ol>
  </div>
);

export default DefaultStopsMessage;
