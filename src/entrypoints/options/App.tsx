import MdiCarShiftPattern from "@iconify-solid/mdi/car-shift-pattern";
import MdiCog from "@iconify-solid/mdi/cog";
import MdiFormatListBulletedSquare from "@iconify-solid/mdi/format-list-bulleted-square";
import MdiInformationOutline from "@iconify-solid/mdi/information-outline";
import { type Component, createSignal, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";
import { About, Exclusions, Rules, Settings } from "./pages";

const pages = {
  rules: { labelKey: "nav.rules", icon: MdiCarShiftPattern, component: Rules },
  settings: { labelKey: "nav.settings", icon: MdiCog, component: Settings },
  exclusions: { labelKey: "nav.exclusions", icon: MdiFormatListBulletedSquare, component: Exclusions },
  about: { labelKey: "nav.about", icon: MdiInformationOutline, component: About },
} as const;

type PageKey = keyof typeof pages;

const getPageFromHash = (): PageKey => {
  const key = location.hash.slice(1) as PageKey;
  return key in pages ? key : "rules";
};

const App: Component = () => {
  const [currentPage, setCurrentPage] = createSignal<PageKey>(
    getPageFromHash(),
  );

  const onHashChange = () => {
    setCurrentPage(getPageFromHash());
  };

  window.addEventListener("hashchange", onHashChange);
  onCleanup(() => {
    window.removeEventListener("hashchange", onHashChange);
  });

  return (
    <div class="flex min-h-screen bg-neutral-50 text-base text-content">
      <aside class="w-50 p-6">
        <img
          src="/icon-96.png"
          alt="logo"
          class="mx-auto my-2.5 w-full max-w-17.5"
          style="image-rendering: pixelated;"
        />
        <ul class="sticky top-0 pt-2">
          {Object.entries(pages).map(([key, page]) => (
            <li class="my-3">
              <a
                href={`#${key}`}
                class={`my-7.5 flex items-center gap-3 px-3 text-lg transition-colors hover:text-accent ${
                  currentPage() === key ? "text-accent" : ""
                }`}
              >
                <page.icon width="32" height="32" />
                <span>{i18n.t(page.labelKey)}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <main
        class={`${currentPage() === "rules" ? "" : "max-w-2xl"} flex-1 px-8 py-4`}
      >
        <header class="mb-5 border-outline-light border-b py-3 text-2xl">
          {i18n.t(pages[currentPage()].labelKey)}
        </header>
        <Dynamic component={pages[currentPage()].component} />
      </main>
    </div>
  );
};

export default App;
