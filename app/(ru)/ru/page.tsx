import { JsonLd } from "../../../components/JsonLd";
import { HomePage } from "../../../components/pages/HomePage";
import { HOME } from "../../../lib/content/home";
import { faqPage } from "../../../lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={faqPage(HOME.ru.faq.items)} />
      <HomePage locale="ru" />
    </>
  );
}
