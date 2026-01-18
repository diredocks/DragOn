import type { JSXElement } from "solid-js";

type PopupBoxProps = {
  trigger: JSXElement;
  children: JSXElement;
};

export function PopupBox(props: PopupBoxProps) {
  let dialogRef!: HTMLDialogElement;

  const openModal = () => {
    dialogRef.showModal();
  };

  const closeModal = () => {
    dialogRef.close();
  };

  const onDialogClick = (e: MouseEvent) => {
    if (e.target === dialogRef) {
      closeModal();
    }
  };

  return (
    <>
      <div class="inline-block cursor-pointer" onclick={openModal}>
        {props.trigger}
      </div>

      <dialog
        ref={dialogRef}
        onclick={onDialogClick}
        class="popup-dialog h-full w-full bg-transparent backdrop:bg-black/30"
      >
        <div
          class="popup-panel rounded bg-white p-5 shadow"
          onclick={(e) => e.stopPropagation()}
        >
          {props.children}
        </div>

        <style>
          {`
						.popup-dialog {
							display: none;
							align-items: center;
							justify-content: center;
							border: none;
							transition: display 0.4s allow-discrete, overlay 0.4s allow-discrete;
						}

						.popup-dialog[open] {
							display: flex;
						}

						.popup-dialog::backdrop {
							background-color: rgba(0, 0, 0, 0);
							transition: background-color 0.3s;
						}
						.popup-dialog[open]::backdrop {
							background-color: rgba(0, 0, 0, 0.3);
						}

						.popup-panel {
							opacity: 0;
							transform: scale(0.9);
							transition: opacity 0.3s, transform 0.3s;
						}

						.popup-dialog[open] .popup-panel {
							opacity: 1;
							transform: scale(1);
						}

						@starting-style {
							.popup-dialog[open] .popup-panel {
								opacity: 0;
								transform: scale(0.9);
							}
							.popup-dialog[open]::backdrop {
								background-color: rgba(0, 0, 0, 0);
							}
						}
					`}
        </style>
      </dialog>
    </>
  );
}
