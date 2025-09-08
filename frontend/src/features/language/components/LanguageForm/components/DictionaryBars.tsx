import { ScrollArea } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { DictionaryBar } from "./DictionaryBar/DictionaryBar";
import type { Dictionary, LanguageForm } from "../../../api/types";

interface DictionaryBars {
  form: UseFormReturnType<LanguageForm>;
}

export function DictionaryBars({ form }: DictionaryBars) {
  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reordered = reorderList(
      form.getValues().dictionaries,
      result.source.index,
      result.destination.index
    );

    form.setFieldValue("dictionaries", reordered);
  }

  return (
    <ScrollArea.Autosize mah={300} offsetScrollbars="y" flex={1}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dnd-list" direction="vertical">
          {(droppableProvided) => (
            <div
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}>
              {form.getValues().dictionaries.map((dict, index) => (
                <Draggable index={index} draggableId={dict.url} key={dict.url}>
                  {(draggableProvided) => (
                    <DictionaryBar
                      form={form}
                      index={index}
                      dndProvided={draggableProvided}
                    />
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ScrollArea.Autosize>
  );
}

function reorderList(list: Dictionary[], startIndex: number, endIndex: number) {
  const result = list;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
