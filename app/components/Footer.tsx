import { Text } from "@cloudflare/kumo";

import cookie from "../assets/cookie.png";

const Footer = () => (
  <footer className="my-10 text-center">
    <div>
      <Text variant="secondary" size="sm" >
        Find valid stopIDs{" "}
        <a
          href="https://till.mabe.at/rbl/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-kumo-link hover:underline"
          aria-label="Find valid stopIDs here"
        >
          here
        </a>
        .
      </Text>
      <Text variant="secondary" size="sm">
        e.g. <code className="rounded bg-kumo-fill px-1">/?stopID=4111&amp;stopID=4118</code> to
        specify stopIDs.
      </Text>
    </div>
    <div className="mt-2">
      <Text variant="secondary" size="sm">
        <img src={cookie} alt="Cookie" className="inline-block h-5 w-5" />
        This website is cookie-free and{" "}
        <a
          href="https://github.com/maximilianzuern/wiener-linien-dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-kumo-link hover:underline"
          aria-label="View the open-source project on GitHub"
        >
          open-source
        </a>
        .
      </Text>
      <Text variant="secondary" size="sm">
        Built by{" "}
        <a
          href="https://maximilianzuern.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-kumo-link hover:underline"
          aria-label="Visit Maximilian's website"
        >
          Maximilian
        </a>
        .
      </Text>
    </div>
  </footer>
);

export default Footer;
