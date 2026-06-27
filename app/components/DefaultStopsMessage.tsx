import { Banner, Text } from "@cloudflare/kumo";
import { Info } from "lucide-react";
import { Link } from "react-router";

const DefaultStopsMessage = () => (
  <Banner
    className="mb-4"
    icon={<Info className="h-5 w-5" />}
    variant="alert"
    title="No StopID Selected? No Problem!"
    description={
      <Text DANGEROUS_className="space-y-1 text-inherit">
        <p>
          This dashboard shows real-time Wiener Linien departures using their{" "}
          <a
            href="https://www.data.gv.at/datasets/cfba4373-a654-3e0b-80f8-348738169f95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kumo-link hover:underline"
          >
            official API
          </a>
          .
        </p>
        <p>Flame and snowflake icons show whether a metro is air-conditioned.</p>
        <p>Want to choose your own stops?</p>
        <ol className="list-inside list-decimal">
          <li>
            Find the stopIDs{" "}
            <a
              href="https://till.mabe.at/rbl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-kumo-link hover:underline"
            >
              here
            </a>
          </li>
          <li>
            Add them to the URL:{" "}
            <code>
              <Link
                to="/?stopID=4111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-kumo-link hover:underline"
                aria-label="View stopID 4111"
              >
                /?stopID=4111
              </Link>
            </code>
            <br /> Or use multiple stopIDs:{" "}
            <code>
              <Link
                to="/?stopID=4111&stopID=4120"
                target="_blank"
                rel="noopener noreferrer"
                className="text-kumo-link hover:underline"
                aria-label="View multiple stopIDs 4111 and 4120"
              >
                /?stopID=4111&stopID=4120
              </Link>
            </code>
          </li>
        </ol>
      </Text>
    }
  />
);

export default DefaultStopsMessage;
