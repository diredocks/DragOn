import { Icon } from "@iconify-icon/solid";
import { type Component, createSignal, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";
import { About, Rules, Settings } from "./pages";

const pages = {
  rules: { label: "Rules", icon: "mdi:car-shift-pattern", component: Rules },
  settings: { label: "Settings", icon: "mdi:cog", component: Settings },
  about: { label: "About", icon: "mdi:information-outline", component: About },
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
    <div class="flex min-h-screen text-base text-content">
      <aside class="w-54 border-outline-light border-r p-6">
        <ul class="sticky top-0 pt-2">
          {Object.entries(pages).map(([key, page]) => (
            <li class="my-3">
              <a
                href={`#${key}`}
                class={`flex items-center gap-3 px-3 py-2 transition-colors hover:text-accent ${
                  currentPage() === key ? "font-medium text-accent" : ""
                }`}
              >
                <Icon icon={page.icon} width="30" height="30" />
                <span>{page.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <main class="max-w-2xl flex-1 px-8 py-4">
        <header class="mb-5 border-outline-light border-b py-3 text-2xl">
          {pages[currentPage()].label}
        </header>
        <Dynamic component={pages[currentPage()].component} />
      </main>
    </div>
  );
};

export default App;
