import { ScrollArea } from "@mantine/core";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import DictionaryBar from "./DictionaryBar/DictionaryBar";

function DictionaryBars({ form }) {
  function reorderList(list, startIndex, endIndex) {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  function onDragEnd(result) {
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
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {form.getValues().dictionaries.map((dict, index) => (
                <Draggable index={index} draggableId={dict.key} key={dict.key}>
                  {(provided) => (
                    <DictionaryBar
                      form={form}
                      index={index}
                      dndProvided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ScrollArea.Autosize>
  );
}

export default DictionaryBars;
