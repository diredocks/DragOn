import { Icon } from "@iconify-icon/solid";
import type { JSXElement } from "solid-js";
import "@/entrypoints/options/styles/popup.css";

type PopupBoxProps = {
  trigger: JSXElement;
  children: JSXElement;
  title: string;
};

export function PopupBox(props: PopupBoxProps) {
  let dialogRef!: HTMLDialogElement;
  let closing = false;

  const openModal = () => {
    if (closing) return;
    dialogRef.showModal();
  };

  const closeModal = () => {
    if (closing) return;
    closing = true;

    dialogRef.setAttribute("data-closing", "");

    // 等动画结束再真正 close
    setTimeout(() => {
      dialogRef.removeAttribute("data-closing");
      dialogRef.close();
      closing = false;
    }, 250); // 与 CSS transition 时间一致
  };

  const onDialogClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      closeModal();
    }
  };

  const onCancel = (e: Event) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
      <div class="inline-block cursor-pointer" onclick={openModal}>
        {props.trigger}
      </div>

      <dialog
        ref={dialogRef}
        onclick={onDialogClick}
        oncancel={onCancel}
        class="popup-dialog invisible flex h-full max-h-screen w-full max-w-full items-center justify-center bg-transparent outline-0 open:visible"
      >
        <div
          class="popup-panel flex flex-col rounded-sm bg-white text-content shadow"
          onclick={(e) => e.stopPropagation()}
        >
          <div class="flex items-center border-[#eaeaea] border-b bg-[#fbfbfb] px-5 py-3.75 text-lg">
            <span>{props.title}</span>
            <Icon
              onclick={closeModal}
              class="ml-auto hover:cursor-pointer hover:text-red-400"
              icon="mdi:close"
              width="22"
              height="22"
            />
          </div>
          <div class="p-5">{props.children}</div>
        </div>
      </dialog>
    </>
  );
}
