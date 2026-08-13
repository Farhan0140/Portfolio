import Modal from './Modal';

export default function ConfirmDialog({ open, title = 'Are you sure?', message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="p-5">
        <p className="text-slate-300 text-sm">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              'px-4 py-2 rounded-lg text-sm font-medium transition ' +
              (danger ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-sky-600 hover:bg-sky-500 text-white')
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
