import Footer from "./Footer";

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="container mx-auto p-2">
    <h1 className="text-xl font-bold text-center mb-2">Vienna Public Transport</h1>
    <div className="text-center text-red-500 font-semibold my-10">{message}</div>
    <Footer />
  </div>
);

export default ErrorMessage;
