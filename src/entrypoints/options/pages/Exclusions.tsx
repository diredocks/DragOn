import close from "@iconify/icons-mdi/close-circle";
import { Icon } from "@iconify-icon/solid";

export function Exclusions() {
  return (
    <>
      <span class="text-accent underline">Information:</span>
      <span>
        {
          ' Add URL match patterns to disable DragOn for certain websites. The match pattern allows "*" wildcards and must be in the form of <scheme>://<host><path>.'
        }
      </span>
      <hr class="my-5 border-outline-light" />
      <form class="flex items-stretch">
        <input
          class="flex-1 appearance-none rounded-sm rounded-r-none border border-outline border-r-0 bg-white px-3 py-1.5 text-base outline-accent"
          placeholder="Enter URL match pattern"
          autofocus
        ></input>
        <button
          type="button"
          class="cursor-pointer rounded-sm rounded-l-none bg-accent px-5 text-content-inverse"
        >
          Add
        </button>
      </form>
      <ul class="pt-5">
        <li class="flex items-center pb-5">
          <div class="flex-1 pr-5">https://example.com</div>
          <button
            type="button"
            class="flex items-center opacity-20 hover:text-danger hover:opacity-90"
          >
            <Icon icon={close} width="20" height="20" />
          </button>
        </li>
      </ul>
    </>
  );
}
