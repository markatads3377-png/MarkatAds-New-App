import { createFileRoute } from "@tanstack/react-router";
import { NotFoundComponent } from "./__root";

export const Route = createFileRoute("/$")({
  component: NotFoundComponent,
});
