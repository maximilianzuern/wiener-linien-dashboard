import Footer from "./Footer";

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="container mx-auto p-2">
    <h1 className="mb-2 text-center text-xl font-bold">Vienna Public Transport</h1>
    <div className="my-10 text-center font-semibold text-red-500">{message}</div>
    <Footer />
  </div>
);

export default ErrorMessage;
