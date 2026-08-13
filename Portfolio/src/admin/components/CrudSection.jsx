import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { usePreviewBase } from '../context/PreviewDataContext';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import EntityForm from './EntityForm';
import LivePreviewPane from './LivePreviewPane';
import SortableList from './SortableList';

function Skeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 rounded-lg bg-slate-800/60 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ label, onAdd }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 py-14 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-500 text-lg">
        ＋
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
      <button type="button" onClick={onAdd} className="mt-3 text-sm text-sky-400 hover:text-sky-300 font-medium transition">
        + Add the first one
      </button>
    </div>
  );
}

export default function CrudSection({
  resource,
  title,
  description,
  fields,
  defaultValues,
  renderRow,
  emptyLabel = 'Nothing here yet.',
  previewSection,
  dataKey,
}) {
  const toast = useToast();
  const { refresh: refreshPreviewBase } = usePreviewBase();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [modalItem, setModalItem] = useState(null); // { id: null|number, values }
  const [draftValues, setDraftValues] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(() => {
    setError(null);
    adminApi
      .list(resource)
      .then(setItems)
      .catch((err) => setError(err.message));
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    const values = { ...defaultValues, isPublished: true };
    setModalItem({ id: null, values });
    setDraftValues(values);
  };

  const openEdit = (item) => {
    setModalItem({ id: item.id, values: item });
    setDraftValues(item);
  };

  const closeModal = () => {
    setModalItem(null);
    setDraftValues(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (modalItem.id == null) {
        await adminApi.create(resource, values);
        toast.success(`${title} added.`);
      } else {
        await adminApi.update(resource, modalItem.id, values);
        toast.success(`${title} updated.`);
      }
      closeModal();
      load();
      refreshPreviewBase();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await adminApi.remove(resource, target.id);
      toast.success(`${title} deleted.`);
      load();
      refreshPreviewBase();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReorder = async (ids) => {
    const byId = new Map(items.map((i) => [i.id, i]));
    setItems(ids.map((id) => byId.get(id)));
    try {
      await adminApi.reorder(resource, ids);
      refreshPreviewBase();
    } catch (err) {
      toast.error('Could not save the new order: ' + err.message);
      load();
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-md shadow-sky-950/30 transition"
        >
          + Add
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/60 text-red-100 text-sm px-4 py-3 mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={load} className="underline shrink-0 ml-3">
            Retry
          </button>
        </div>
      )}

      {items === null && !error && <Skeleton />}

      {items !== null && items.length === 0 && <EmptyState label={emptyLabel} onAdd={openAdd} />}

      {items !== null && items.length > 0 && (
        <SortableList
          items={items}
          onReorder={handleReorder}
          className="space-y-2"
          renderItem={(item) => (
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 flex items-center justify-between gap-4 hover:border-slate-700 hover:bg-slate-900 transition">
              <div className="min-w-0 flex-1">{renderRow(item)}</div>
              <div className="shrink-0 flex items-center gap-2">
                {!item.isPublished && (
                  <span className="text-[11px] uppercase tracking-wide px-2 py-1 rounded bg-amber-900/50 text-amber-300 border border-amber-800">
                    Draft
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium border border-red-900 text-red-300 hover:bg-red-950 hover:border-red-800 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        />
      )}

      <Modal open={Boolean(modalItem)} onClose={closeModal} title={modalItem?.id == null ? `Add ${title}` : `Edit ${title}`} wide={Boolean(previewSection)}>
        {modalItem && (
          <div className={previewSection ? 'grid grid-cols-1 md:grid-cols-2' : ''}>
            <EntityForm
              fields={fields}
              initialValues={modalItem.values}
              onCancel={closeModal}
              onSubmit={handleSubmit}
              onValuesChange={setDraftValues}
              submitting={submitting}
            />
            {previewSection && (
              <div className="border-t md:border-t-0 md:border-l border-slate-800 h-[70vh]">
                <LivePreviewPane PreviewSection={previewSection} dataKey={dataKey || resource} draftItem={draftValues} editingId={modalItem.id} />
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete this ${title.toLowerCase()}?`}
        message="This can't be undone. The item will disappear from the public site immediately."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
