import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("buy", "routes/buy.tsx"),
  route("buyer-presentation", "routes/buyer-presentation.tsx"),
  route("property-search", "routes/property-search.tsx"),
  route("saved-properties", "routes/saved-properties.tsx"),
  route("exchange-support", "routes/exchange-support.tsx"),
  route("individual-property-page", "routes/individual-property-page.tsx")
] satisfies RouteConfig;
