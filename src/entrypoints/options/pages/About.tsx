export function About() {
  const manifest = browser.runtime.getManifest();

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
        <span class="after:px-2.5 after:opacity-20 after:content-['\25CF']" />
        <a
          href="https://github.com/diredocks/DragOn"
          class="text-accent underline decoration-dotted after:inline-block after:pl-[0.25em] after:no-underline after:content-['_↗'] hover:decoration-solid"
        >
          {i18n.t("about.sourceCode")}
        </a>
      </p>
    </>
  );
}
