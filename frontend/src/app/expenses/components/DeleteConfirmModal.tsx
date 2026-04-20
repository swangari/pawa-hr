"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] transition-opacity duration-300 ease-out"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-300 pointer-events-auto overflow-hidden border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header & Content */}
          <div className="p-8 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 ring-8 ring-red-50/50">
              <span className="material-icons-outlined text-red-500 text-[32px]">
                delete_forever
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
              {title}
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed px-2">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-50 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-200 border border-slate-200/50 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 transition-all duration-200 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
