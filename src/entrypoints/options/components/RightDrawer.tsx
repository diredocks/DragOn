import type { JSXElement } from "solid-js";

type RightDrawerProps = {
  isOpen: boolean;
  onClose?: () => void;
  onAfterClose?: () => void;
  children?: JSXElement;
};

export function RightDrawer(props: RightDrawerProps) {
  let dialogRef!: HTMLDialogElement;
  let closeTimeout: ReturnType<typeof setTimeout> | null = null;

  const clearCloseTimeout = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  };

  const startClose = () => {
    if (!dialogRef.open || dialogRef.hasAttribute("data-closing")) return;

    dialogRef.setAttribute("data-closing", "");
    clearCloseTimeout();

    closeTimeout = setTimeout(() => {
      closeTimeout = null;
      dialogRef.removeAttribute("data-closing");
      if (dialogRef.open) dialogRef.close();
      props.onAfterClose?.();
    }, 300);
  };

  const onDialogClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      props.onClose?.();
    }
  };

  const onCancel = (e: Event) => {
    e.preventDefault();
    props.onClose?.();
  };

  createEffect(() => {
    if (!dialogRef) return;
    if (props.isOpen) {
      clearCloseTimeout();
      dialogRef.removeAttribute("data-closing");
      if (!dialogRef.open) dialogRef.showModal();
    } else {
      if (dialogRef.open) startClose();
    }
  });

  onCleanup(() => {
    clearCloseTimeout();
  });

  return (
    <dialog
      ref={dialogRef}
      onclick={onDialogClick}
      oncancel={onCancel}
      class="drawer-dialog invisible fixed m-auto block h-full max-h-none w-full max-w-none overflow-hidden bg-transparent outline-0 open:visible"
    >
      <aside class="drawer-panel ml-auto h-full w-100 max-w-[90vw] bg-white p-6 text-content shadow-sm">
        {props.children}
      </aside>
    </dialog>
  );
}
