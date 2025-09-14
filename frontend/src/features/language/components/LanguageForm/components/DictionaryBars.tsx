import { ScrollArea } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableContainer } from "./DraggableContainer";
import { DictionaryBar } from "./DictionaryBar/DictionaryBar";
import type { LanguageForm } from "../../../api/types";
import { MIN_DICT_COUNT } from "../../../../../resources/constants";

interface DictionaryBars {
  form: UseFormReturnType<LanguageForm>;
}

export function DictionaryBars({ form }: DictionaryBars) {
  const dicts = form.getValues().dictionaries;
  const numOfDicts = dicts.length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = dicts.findIndex((dict) => dict.id === active.id);
    const newIndex = dicts.findIndex((dict) => dict.id === over.id);
    const reordered = arrayMove(dicts, oldIndex, newIndex);
    form.setFieldValue("dictionaries", reordered);
  }

  function handleRemoveDict(index: number) {
    return () => {
      if (numOfDicts > MIN_DICT_COUNT) {
        form.removeListItem("dictionaries", index);
      }
    };
  }

  return (
    <ScrollArea.Autosize mah={300} offsetScrollbars="y" flex={1}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={dicts.map((dict) => dict.id)}
          strategy={verticalListSortingStrategy}>
          {dicts.map((dict, index) => (
            <DraggableContainer key={dict.id} id={dict.id}>
              <DictionaryBar
                dict={dict}
                index={index}
                form={form}
                editable={numOfDicts > MIN_DICT_COUNT}
                onRemove={handleRemoveDict(index)}
              />
            </DraggableContainer>
          ))}
        </SortableContext>
      </DndContext>
    </ScrollArea.Autosize>
  );
}
