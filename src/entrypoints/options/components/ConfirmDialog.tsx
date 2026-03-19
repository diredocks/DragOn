import { createSignal, type JSXElement } from "solid-js";
import { PopupBox } from "./PopupBox";

type ConfirmDialogVariant = "default" | "danger";

type ConfirmDialogProps = {
  title: string;
  children?: JSXElement;
  variant?: ConfirmDialogVariant;
  onConfirm: () => void;
  onCancel?: () => void;
};

export function ConfirmDialog(props: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const handleConfirm = () => {
    setIsOpen(false);
    props.onConfirm();
  };

  const handleCancel = () => {
    setIsOpen(false);
    props.onCancel?.();
  };

  const confirmBtnClass = () =>
    props.variant === "default"
      ? "cursor-pointer rounded-sm bg-accent px-4 py-1.25 text-content-inverse outline-accent"
      : "cursor-pointer rounded-sm bg-danger px-4 py-1.25 text-white outline-danger";

  const triggerBtnClass = () =>
    props.variant === "default"
      ? "cursor-pointer rounded-sm border border-outline bg-white px-8 py-1.5 text-content transition-colors duration-300 hover:border-gray-400"
      : "cursor-pointer rounded-sm border border-outline bg-white px-8 py-1.5 text-content transition-all duration-300 hover:border-danger hover:bg-danger hover:text-content-inverse";

  return (
    <PopupBox
      trigger={
        <button type="button" class={triggerBtnClass()}>
          {props.title}
        </button>
      }
      title={props.title}
      isOpen={isOpen()}
      onOpen={() => setIsOpen(true)}
      onClose={handleCancel}
    >
      <div class="flex flex-col gap-5">
        <div class="text-content">{props.children}</div>
        <div class="flex justify-end gap-2.5">
          <button
            type="button"
            onclick={handleCancel}
            class="cursor-pointer rounded-sm border border-outline bg-white px-4 py-1.25 text-content transition-colors duration-300 hover:border-gray-400"
          >
            {i18n.t("common.cancel")}
          </button>
          <button
            type="button"
            onclick={handleConfirm}
            class={confirmBtnClass()}
          >
            {i18n.t("common.confirm")}
          </button>
        </div>
      </div>
    </PopupBox>
  );
}
