import { NotFoundView } from "../../components/NotFoundView";
import { ui } from "../../lib/content/ui";
import { LOCALES } from "../../lib/i18n";

export default function NotFound() {
  return (
    <NotFoundView
      strings={Object.fromEntries(LOCALES.map((l) => [l, ui(l).notFound])) as Parameters<
        typeof NotFoundView
      >[0]["strings"]}
    />
  );
}
