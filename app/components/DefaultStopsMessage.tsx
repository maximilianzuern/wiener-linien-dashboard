import { Link } from "react-router";

import busStop from "../assets/busStop.png";

const DefaultStopsMessage = () => (
  <div
    className="mb-4 border-l-4 border-yellow-500 bg-yellow-100 p-4 text-base text-yellow-700"
    role="alert"
  >
    <h2 className="flex items-center gap-1 font-bold">
      <img src={busStop} alt="" className="h-8 w-8" />
      <span>No StopID Selected? No Problem!</span>
    </h2>
    <p>
      This dashboard shows real-time Wiener Linien departures using their{" "}
      <a
        href="https://www.data.gv.at/datasets/cfba4373-a654-3e0b-80f8-348738169f95"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-blue-600"
      >
        official API
      </a>
      .
    </p>
    <p>Flame and snowflake icons show whether a metro is air-conditioned.</p>
    <p className="mt-1">Want to choose your own stops?</p>
    <ol className="list-inside list-decimal">
      <li>
        Find the stopIDs{" "}
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
        Add them to the URL:{" "}
        <code className="rounded bg-yellow-200 px-1">
          <Link
            to="/?stopID=4111"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600"
            aria-label="View stopID 4111"
          >
            /?stopID=4111
          </Link>
        </code>
        <br /> Or use multiple stopIDs:{" "}
        <code className="rounded bg-yellow-200 px-1">
          <Link
            to="/?stopID=4111&stopID=4120"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600"
            aria-label="View multiple stopIDs 4111 and 4120"
          >
            /?stopID=4111&stopID=4120
          </Link>
        </code>
      </li>
    </ol>
  </div>
);

export default DefaultStopsMessage;
