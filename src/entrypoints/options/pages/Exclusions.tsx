import MdiCloseCircle from "@iconify-solid/mdi/close-circle";
import { exclusionsStorage } from "@/shared/settings/storage";

const checkURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function Exclusions() {
  const [exclusions, setExclusions] = createStore<string[]>([
    ...exclusionsStorage.fallback,
  ]);
  const [input, setInput] = createSignal("");

  exclusionsStorage.getValue().then((v) => setExclusions([...v]));
  const unwatch = exclusionsStorage.watch((v) => setExclusions([...v]));
  onCleanup(unwatch);

  const handleAdd = () => {
    const pattern = input().trim();
    if (!pattern || !checkURL(pattern) || exclusions.includes(pattern)) return;
    const next = [...exclusions, pattern];
    setExclusions(next);
    exclusionsStorage.setValue(next);
    setInput("");
  };

  const [removing, setRemoving] = createSignal(new Set<string>());

  const handleRemove = (pattern: string) => {
    setRemoving((prev) => new Set([...prev, pattern]));
    setTimeout(() => {
      const next = exclusions.filter((p) => p !== pattern);
      setExclusions(next);
      exclusionsStorage.setValue(next);
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(pattern);
        return next;
      });
    }, 200);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <>
      <span class="text-accent underline">
        {i18n.t("exclusions.info.label")}
      </span>
      <span> {i18n.t("exclusions.info.description")}</span>
      <hr class="my-5 border-outline-light" />
      <form class="flex items-stretch" onSubmit={(e) => e.preventDefault()}>
        <input
          class="flex-1 appearance-none rounded-sm rounded-r-none border border-outline border-r-0 bg-white px-3 py-1.5 text-base outline-accent"
          placeholder={i18n.t("exclusions.placeholder")}
          autofocus
          value={input()}
          onInput={(e) => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          class="cursor-pointer rounded-sm rounded-l-none bg-accent px-5 text-content-inverse"
          onClick={handleAdd}
        >
          {i18n.t("exclusions.add")}
        </button>
      </form>
      <Show when={exclusions.length === 0}>
        <p class="pt-5 text-center opacity-40">{i18n.t("exclusions.empty")}</p>
      </Show>
      <ul class="divide-y divide-outline-light pt-5">
        <Index each={exclusions}>
          {(_each, index) => (
            <li
              class="exclusion-item flex items-center py-3"
              data-removing={removing().has(exclusions[index]) || undefined}
            >
              <div class="flex-1 pr-5">{exclusions[index]}</div>
              <button
                type="button"
                class="flex items-center opacity-20 hover:text-danger hover:opacity-90"
                onClick={() => handleRemove(exclusions[index])}
              >
                <MdiCloseCircle width="20" height="20" />
              </button>
            </li>
          )}
        </Index>
      </ul>
    </>
  );
}
