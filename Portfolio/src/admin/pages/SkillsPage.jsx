import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { usePreviewBase } from '../context/PreviewDataContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EntityForm from '../components/EntityForm';
import SortableList from '../components/SortableList';

const categoryFields = [
  { name: 'title', label: 'Category title', type: 'text', required: true, maxLength: 100 },
  { name: 'icon', label: 'Category icon', type: 'icon', required: true },
];

const itemFields = [
  { name: 'label', label: 'Skill / tool name', type: 'text', required: true, maxLength: 100 },
  { name: 'icon', label: 'Icon', type: 'icon', required: true },
];

// Nested categories→items doesn't fit the flat-list live-preview mechanism
// the other CrudSection pages use, so this page is bespoke — but built from
// the same Modal/EntityForm/SortableList/ConfirmDialog primitives. Changes
// still show on the live site immediately after Save.
export default function SkillsPage() {
  const toast = useToast();
  const { refresh: refreshPreviewBase } = usePreviewBase();
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);

  const [categoryModal, setCategoryModal] = useState(null); // { id, values }
  const [itemModal, setItemModal] = useState(null); // { categoryId, id, values }
  const [deleteTarget, setDeleteTarget] = useState(null); // { kind: 'category'|'item', id, label }
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setError(null);
    adminApi
      .list('skill-categories')
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  const afterChange = () => {
    load();
    refreshPreviewBase();
  };

  // ---- category CRUD ----
  const saveCategory = async (values) => {
    setSubmitting(true);
    try {
      if (categoryModal.id == null) {
        await adminApi.create('skill-categories', values);
        toast.success('Category added.');
      } else {
        await adminApi.update('skill-categories', categoryModal.id, values);
        toast.success('Category updated.');
      }
      setCategoryModal(null);
      afterChange();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reorderCategories = async (ids) => {
    const byId = new Map(categories.map((c) => [c.id, c]));
    setCategories(ids.map((id) => byId.get(id)));
    try {
      await adminApi.reorder('skill-categories', ids);
      refreshPreviewBase();
    } catch (err) {
      toast.error('Could not save the new order: ' + err.message);
      load();
    }
  };

  // ---- item CRUD ----
  const saveItem = async (values) => {
    setSubmitting(true);
    try {
      const body = { ...values, categoryId: itemModal.categoryId };
      if (itemModal.id == null) {
        await adminApi.create('skill-items', body);
        toast.success('Skill added.');
      } else {
        await adminApi.update('skill-items', itemModal.id, body);
        toast.success('Skill updated.');
      }
      setItemModal(null);
      afterChange();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reorderItems = async (category, ids) => {
    const byId = new Map(category.items.map((i) => [i.id, i]));
    setCategories((cats) => cats.map((c) => (c.id === category.id ? { ...c, items: ids.map((id) => byId.get(id)) } : c)));
    try {
      await adminApi.reorder('skill-items', ids);
      refreshPreviewBase();
    } catch (err) {
      toast.error('Could not save the new order: ' + err.message);
      load();
    }
  };

  const handleDelete = async () => {
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      if (target.kind === 'category') {
        await adminApi.remove('skill-categories', target.id);
      } else {
        await adminApi.remove('skill-items', target.id);
      }
      toast.success('Deleted.');
      afterChange();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Skills & Tools</h1>
          <p className="text-sm text-slate-400 mt-1">Categories and the skills/tools within each one.</p>
        </div>
        <button
          type="button"
          onClick={() => setCategoryModal({ id: null, values: { title: '', icon: '', isPublished: true } })}
          className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white transition"
        >
          + Add category
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

      {categories === null && !error && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      )}

      {categories !== null && categories.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center">
          <p className="text-slate-400 text-sm">No skill categories yet.</p>
        </div>
      )}

      {categories !== null && categories.length > 0 && (
        <SortableList
          items={categories}
          onReorder={reorderCategories}
          className="space-y-4"
          renderItem={(category) => (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-5 h-5 text-sky-400 shrink-0" aria-hidden="true">
                    <use href={`#${category.icon}`} />
                  </svg>
                  <p className="font-medium text-slate-100 truncate">{category.title}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setItemModal({ categoryId: category.id, id: null, values: { label: '', icon: '', isPublished: true } })}
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
                  >
                    + Add skill
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryModal({ id: category.id, values: category })}
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ kind: 'category', id: category.id, label: category.title })}
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-red-900 text-red-300 hover:bg-red-950 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {category.items.length === 0 ? (
                <p className="text-sm text-slate-500 pl-2">No skills in this category yet.</p>
              ) : (
                <SortableList
                  items={category.items}
                  onReorder={(ids) => reorderItems(category, ids)}
                  className="space-y-1.5"
                  renderItem={(item) => (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true">
                          <use href={`#${item.icon}`} />
                        </svg>
                        <p className="text-sm text-slate-200 truncate">{item.label}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setItemModal({ categoryId: category.id, id: item.id, values: item })}
                          className="px-2.5 py-1 rounded-md text-xs border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ kind: 'item', id: item.id, label: item.label })}
                          className="px-2.5 py-1 rounded-md text-xs border border-red-900 text-red-300 hover:bg-red-950 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
          )}
        />
      )}

      <Modal open={Boolean(categoryModal)} onClose={() => setCategoryModal(null)} title={categoryModal?.id == null ? 'Add category' : 'Edit category'}>
        {categoryModal && (
          <EntityForm
            fields={categoryFields}
            initialValues={categoryModal.values}
            onCancel={() => setCategoryModal(null)}
            onSubmit={saveCategory}
            submitting={submitting}
            showPublished={false}
          />
        )}
      </Modal>

      <Modal open={Boolean(itemModal)} onClose={() => setItemModal(null)} title={itemModal?.id == null ? 'Add skill' : 'Edit skill'}>
        {itemModal && (
          <EntityForm
            fields={itemFields}
            initialValues={itemModal.values}
            onCancel={() => setItemModal(null)}
            onSubmit={saveItem}
            submitting={submitting}
            showPublished={false}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete "${deleteTarget?.label}"?`}
        message={
          deleteTarget?.kind === 'category'
            ? "This deletes the category and every skill inside it. This can't be undone."
            : "This can't be undone."
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
