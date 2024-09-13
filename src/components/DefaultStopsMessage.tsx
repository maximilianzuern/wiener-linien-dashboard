import Link from "next/link";

const DefaultStopsMessage = () => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
    <h2 className="font-bold">🚏 No StopID Selected? No Problem!</h2>
    <p>
      This site shows real-time Wiener Linien departures powered by their{" "}
      <a
        href="https://www.data.gv.at/katalog/dataset/wiener-linien-echtzeitdaten-via-datendrehscheibe-wien"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-blue-600"
      >
        official API
      </a>
      .
    </p>
    <p>For a breezy experience, air-conditioning emojis are added through reverse engineering.</p>
    <p className="mt-1">Want to customize your view?</p>
    <ol className="list-decimal list-inside">
      <li>
        Find stopIDs{" "}
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
        Add them to the URL like this:{" "}
        <code className="bg-yellow-200 px-1 rounded">
          <Link
            href="/?stopID=4111"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600"
            aria-label="View stopID 4111"
          >
            /?stopID=4111
          </Link>
        </code>
        <br /> or for multiple stopIDs:{" "}
        <code className="bg-yellow-200 px-1 rounded">
          <Link
            href="/?stopID=4111&stopID=4120"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600"
            aria-label="View multiple stopIDs 4111 and 4120"
          >
            /?stopID=4111&amp;stopID=4120
          </Link>
        </code>
      </li>
    </ol>
  </div>
);

export default DefaultStopsMessage;
