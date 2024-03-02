import { useState } from "react";
import { Todo, TodoItemStatus } from "./todo";

interface TodoItemProps {
  todo: Todo;
  onComplete: (todo: Todo, completed : boolean) => void;
  onDelete: (todo: Todo) => void;
}

function TodoItem({ todo, onComplete, onDelete }: TodoItemProps) {
  const [completed, setCompleted] = useState(todo.status === TodoItemStatus.Completed);
  
  return (
    <>
      <div className="itemComplted">
        <input type="checkbox" id="completedCheck" className="completedCheckbox" checked={completed} onChange={(e) => {
          setCompleted(e.target.checked);
          onComplete(todo,e.target.checked)
        }} />
      </div>

      <div className="itemName">
        <div>{todo.name}</div>
      </div>

      <div className="itemStartAt">
        <div>{todo.endAt?.toLocaleString() || 'N/A'}</div>
      </div>

      <div className="itemDelete">
        <button
          onClick={() => onDelete(todo)}

        >
          <span>Delete</span>
        </button>
      </div>
    </>
  );
}

export default TodoItem;
