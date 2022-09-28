import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Jaj!</h1>
      <p>Hiba történt mérnöki számításainkban.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}