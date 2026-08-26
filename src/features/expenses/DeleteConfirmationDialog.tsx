type DeleteConfirmationDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmationDialog({
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Confirm deletion">
      <p>Delete this expense? This action cannot be undone.</p>
      <button type="button" onClick={onConfirm}>
        Delete
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
