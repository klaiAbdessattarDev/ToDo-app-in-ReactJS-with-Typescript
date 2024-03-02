import { SyntheticEvent, useState } from "react";
import { Todo, TodoItemStatus } from "./todo";

interface TodoAddFormProps {
  existingTodos: Todo[];
  
  onAdd: (newTodo: Todo) => Promise<void>;
}

function TodoAddForm({ existingTodos, onAdd }: TodoAddFormProps) {
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoEndAt, setNewTodoEndAt] = useState(new Date());
  const [saveNewTodoError, setSaveNewTodoError] = useState("");

  function handleNewTaskNameChange(event: any) {
    const newName = event.target.value;
    setNewTodoText(newName);

    if (existingTodos.some((x) => x.name === newName)) {
      setSaveNewTodoError("Task with this name already exists.");
    } else {
      if (newName.length < 10) {
        setSaveNewTodoError("Task name need to be more than 10 chars.");
      } else {
        setSaveNewTodoError("");
      }
    }

 
  }

  function handleNewTaskStartAtChange(event: any) {
    const newStartAt = event.target.value;
    setNewTodoEndAt(new Date(newStartAt));
  }

  const handleAdd = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (saveNewTodoError.length > 0) return;
    if (newTodoText.length === 0) {
      setSaveNewTodoError("Task name is required.");
      return;
    }

    const newTodo = new Todo({
      name: newTodoText,
      endAt: newTodoEndAt,
      status: TodoItemStatus.Active,
    });

    await onAdd(newTodo);
    setNewTodoText("");
    setNewTodoEndAt(new Date());
  };

  return (
    <form className="addForm" onSubmit={handleAdd}>
      <input
        type="text"
        name="name"
        placeholder="What needs to be done?"
        value={newTodoText}
        onChange={handleNewTaskNameChange}
      />
      <input
        type="datetime-local"
        name="startAt"
        value={newTodoEndAt.toISOString().slice(0,19)}
        onChange={handleNewTaskStartAtChange}
      />
      <button className="primary medium addButton">Add</button>
      {saveNewTodoError.length > 0 && (
        <div className="addError">
          <p>{saveNewTodoError}</p>
        </div>
      )}
    </form>
  );
}

export default TodoAddForm;
