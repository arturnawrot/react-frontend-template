import type { Route } from "./+types/home";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="text-center p-4">
      <h1 className="text-2xl">Hello!</h1>
      <a
        className="block mt-2 text-blue-500 underline hover:text-blue-600"
        href="https://reactrouter.com/how-to/spa"
      >
        React Router SPA Docs
      </a>
    </div>
  );
}