const Footer = () => (
  <div className="my-10 text-center text-sm text-gray-400">
    Find valid stopIDs{" "}
    <a
      href="https://till.mabe.at/rbl/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline"
    >
      here
    </a>
    .
    <br />
    e.g &apos;/?stopID=4111&amp;stopID=4118&apos; to specify stopIDs.
    <br />
    🍪 This website is cookie-free.
  </div>
);

export default Footer;
