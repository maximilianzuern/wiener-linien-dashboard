import Link from "next/link";

const DefaultStopsMessage = () => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
    <h2 className="font-bold">Using default stops</h2>
    <p>To see departures for specific stops:</p>
    <ol className="list-decimal list-inside mt-1">
      <li>
        Find valid stop IDs{" "}
        <a
          href="https://till.mabe.at/rbl/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-600"
        >
          here
        </a>
      </li>
      <li>
        Add to the web address:{" "}
        <code className="bg-yellow-200 px-1 rounded">
          <Link
            href="/?stopID=4111"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
            aria-label="View stopID"
          >
            /?stopID=4111
          </Link>
        </code>
      </li>
      <li>
        For multiple stops, use:{" "}
        <code className="bg-yellow-200 px-1 rounded">
          <Link
            href="/?stopID=4111&stopID=4120"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
            aria-label="View stopID"
          >
            /?stopID=4111&amp;stopID=4120
          </Link>
        </code>
      </li>
    </ol>
  </div>
);

export default DefaultStopsMessage;
