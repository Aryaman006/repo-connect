import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <div style={{ padding: "20px", margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ lineHeight: 1, fontSize: "48px", fontWeight: "bold" }}>
          Oops...
        </h1>
        <p style={{ lineHeight: "36px", fontSize: "30px" }}>
          {isRouteErrorResponse(error)
            ? "This page does not exist."
            : "An unexpected error occurred."}
        </p>
      </div>
    </>
  );
}

export default ErrorPage;
