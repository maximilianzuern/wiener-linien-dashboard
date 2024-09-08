const Footer = () => (
  <footer className="my-10 text-center text-sm text-gray-400">
    <div>
      <p>
        Find valid stopIDs{" "}
        <a
          href="https://till.mabe.at/rbl/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-600"
          aria-label="Find valid stopIDs here"
        >
          here
        </a>
        .
      </p>
      <p>
        e.g. <code className="bg-gray-200 px-1 rounded">/?stopID=4111&amp;stopID=4118</code> to
        specify stopIDs.
      </p>
    </div>
    <div className="mt-2">
      <p>
        🍪 This website is cookie-free and{" "}
        <a
          href="https://github.com/maximilianzuern/wiener-linien-dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-600"
          aria-label="View the open-source project on GitHub"
        >
          open-source
        </a>
        .
      </p>
      <p>
        Built by{" "}
        <a
          href="https://maximilianzuern.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          aria-label="Visit Maximilian's website"
        >
          Maximilian
        </a>
        .
      </p>
    </div>
  </footer>
);

export default Footer;
