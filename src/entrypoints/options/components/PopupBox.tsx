import close from "@iconify/icons-mdi/close";
import { Icon } from "@iconify-icon/solid";
import type { JSXElement } from "solid-js";

type PopupBoxProps = {
  trigger?: JSXElement;
  children: JSXElement;
  title?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export function PopupBox(props: PopupBoxProps) {
  let dialogRef!: HTMLDialogElement;
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;

  const openModal = () => {
    // Cancel pending close if any
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
      dialogRef.removeAttribute("data-closing");
    }
    dialogRef.showModal();
  };

  const closeModal = () => {
    dialogRef.setAttribute("data-closing", "");

    // Wait for animation
    closeTimeout = setTimeout(() => {
      closeTimeout = null;
      dialogRef.removeAttribute("data-closing");
      dialogRef.close();
      props.onClose?.();
    }, 250); // Same time as css transition
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

  const onToggle = () => {
    if (dialogRef.open) {
      props.onOpen?.();
    }
  };

  createEffect(() => {
    if (props.isOpen === undefined) return;

    if (props.isOpen) {
      openModal();
    } else {
      // Close without triggering onClose callback (parent already knows)
      dialogRef.setAttribute("data-closing", "");
      closeTimeout = setTimeout(() => {
        closeTimeout = null;
        dialogRef.removeAttribute("data-closing");
        dialogRef.close();
      }, 250);
    }
  });

  return (
    <>
      {props.trigger && (
        <div class="inline-block cursor-pointer" onclick={openModal}>
          {props.trigger}
        </div>
      )}

      <dialog
        ref={dialogRef}
        onclick={onDialogClick}
        oncancel={onCancel}
        ontoggle={onToggle}
        class="popup-dialog invisible fixed m-auto block overflow-visible bg-transparent outline-0 open:visible"
      >
        <div
          class="popup-panel flex flex-col rounded-sm bg-white text-content shadow"
          // onclick={(e) => e.stopPropagation()}
        >
          <div class="flex items-center rounded-t-sm border-gray-200 border-b bg-[#fbfbfb] px-5 py-3.75 text-lg">
            <span>{props.title}</span>
            <Icon
              onclick={closeModal}
              class="ml-auto hover:cursor-pointer hover:text-red-400"
              icon={close}
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
