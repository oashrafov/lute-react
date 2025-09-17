import { ScrollArea } from "@mantine/core";
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
import type { Dictionary } from "../../../api/types";
import { MIN_DICT_COUNT } from "../../../../../resources/constants";
import type { Control, FieldValues } from "react-hook-form";
import { RemoveDictionaryButton } from "./DictionaryBar/components/RemoveDictionaryButton";

interface DictionaryBars<T extends FieldValues> {
  control: Control<T>;
  dictionaries: Dictionary[];
  onSet: (dicts: Dictionary[]) => void;
  onRemove: (index: number) => void;
}

export function DictionaryBars<T extends FieldValues>({
  control,
  dictionaries,
  onSet,
  onRemove,
}: DictionaryBars<T>) {
  const numOfDicts = dictionaries.length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = dictionaries.findIndex((dict) => dict.id === active.id);
    const newIndex = dictionaries.findIndex((dict) => dict.id === over.id);
    const reordered = arrayMove(dictionaries, oldIndex, newIndex);
    onSet(reordered);
  }

  function handleRemoveDict(index: number) {
    return () => {
      if (numOfDicts > MIN_DICT_COUNT) {
        onRemove(index);
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
          items={dictionaries.map((dict) => dict.id)}
          strategy={verticalListSortingStrategy}>
          {dictionaries.map((dict, index) => (
            <DraggableContainer key={dict.id} id={dict.id}>
              <DictionaryBar
                control={control}
                dict={dict}
                name={`dictionaries.${index}`}
                editable={numOfDicts > MIN_DICT_COUNT}
              />
              <RemoveDictionaryButton
                disabled={numOfDicts <= MIN_DICT_COUNT}
                onClick={handleRemoveDict(index)}
              />
            </DraggableContainer>
          ))}
        </SortableContext>
      </DndContext>
    </ScrollArea.Autosize>
  );
}
