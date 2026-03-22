import { ConfirmDialog, PopupBox } from "@/entrypoints/options/components";
import { Action } from "@/shared/models/action";
import type { RuleSerialized } from "@/shared/models/rule";
import {
  actionSettingsStorage,
  exclusionsStorage,
  rulesStorage,
  traceSettingsStorage,
} from "@/shared/settings/storage";

export function About() {
  const manifest = browser.runtime.getManifest();
  const [restoreResult, setRestoreResult] = createSignal<
    "success" | "failure" | null
  >(null);

  const handleReset = async () => {
    await traceSettingsStorage.removeValue();
    await actionSettingsStorage.removeValue();
    await rulesStorage.removeValue();
    await exclusionsStorage.removeValue();
  };

  const handleBackup = async () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            traceSettings: await traceSettingsStorage.getValue(),
            actionSettings: await actionSettingsStorage.getValue(),
            rules: await rulesStorage.getValue(),
            exclusions: await exclusionsStorage.getValue(),
          },
          null,
          2,
        ),
      ],
      {
        type: "application/json",
      },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DragOn ${manifest.version} ${new Date().toDateString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleRestore = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());

      await traceSettingsStorage.setValue(parsed.traceSettings);
      await actionSettingsStorage.setValue(parsed.actionSettings);
      const rules: RuleSerialized[] = parsed.rules ?? [];
      const actions = await Promise.all(
        rules.flatMap((r) => r.actions.map((a) => Action.fromJSON(a))),
      );
      const granted = await Promise.all(actions.map((a) => a.requestPermissions()));
      if (granted.some((g) => !g)) throw new Error("Permission denied");
      await rulesStorage.setValue(rules);
      await exclusionsStorage.setValue(parsed.exclusions);
      setRestoreResult("success");
    } catch {
      setRestoreResult("failure");
    }

    input.value = "";
  };

  return (
    <>
      <p class="pb-2.5">
        <strong>
          {manifest.name}, {i18n.t("about.version")}: {manifest.version}
        </strong>
      </p>
      <p>
        <strong>{i18n.t("about.license.label")}: </strong>
        {i18n.t("about.license.description")}
      </p>
      <hr class="my-5 border-outline-light" />
      <p>
        <a
          href="https://github.com/diredocks/DragOn/issues"
          class="text-accent underline decoration-dotted after:inline-block after:pl-[0.25em] after:no-underline after:content-['_↗'] hover:decoration-solid"
        >
          {i18n.t("about.reportBug")}
        </a>
        <span class="text-[10px] after:px-2.5 after:opacity-20 after:content-['\25CF']" />
        <a
          href="https://github.com/diredocks/DragOn"
          class="text-accent underline decoration-dotted after:inline-block after:pl-[0.25em] after:no-underline after:content-['_↗'] hover:decoration-solid"
        >
          {i18n.t("about.sourceCode")}
        </a>
      </p>
      <hr class="my-5 border-outline-light" />
      <div class="flex flex-wrap justify-end gap-4">
        <button
          type="button"
          class="cursor-pointer rounded-sm border border-outline bg-white px-8 py-1.5 text-content transition-colors duration-300 hover:border-gray-400"
          onclick={handleBackup}
        >
          {i18n.t("about.backup")}
        </button>
        <label class="cursor-pointer rounded-sm border border-outline bg-white px-8 py-1.5 text-content transition-colors duration-300 hover:border-gray-400">
          <input
            type="file"
            accept="application/json"
            class="hidden"
            onChange={handleRestore}
          />
          {i18n.t("about.restore")}
        </label>
        <ConfirmDialog
          title={i18n.t("about.reset")}
          variant="danger"
          onConfirm={handleReset}
        >
          {i18n.t("about.resetWarning")}
        </ConfirmDialog>
      </div>
      <PopupBox
        title={i18n.t("about.restore")}
        isOpen={restoreResult() !== null}
        onClose={() => setRestoreResult(null)}
      >
        <p>
          {restoreResult() === "success"
            ? i18n.t("about.restoreSuccess")
            : i18n.t("about.restoreFailure")}
        </p>
      </PopupBox>
    </>
  );
}
