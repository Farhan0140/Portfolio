import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-2">
      <button
        type="button"
        aria-label="Drag to reorder"
        className="shrink-0 self-stretch flex items-center px-2 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
      >
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="currentColor" aria-hidden="true">
          <circle cx="6" cy="5" r="1.4" />
          <circle cx="6" cy="10" r="1.4" />
          <circle cx="6" cy="15" r="1.4" />
          <circle cx="14" cy="5" r="1.4" />
          <circle cx="14" cy="10" r="1.4" />
          <circle cx="14" cy="15" r="1.4" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/** Drag-and-drop reorderable list built on dnd-kit; calls onReorder with the new id order. */
export default function SortableList({ items, onReorder, renderItem, className }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = [...items];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);
    onReorder(next.map((i) => i.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem(item, index)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
