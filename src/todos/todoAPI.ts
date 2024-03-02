import { Todo, TodoItemStatus } from "./todo"

const baseUrl = "https://localhost:7268";
const url = `${baseUrl}/api/TodoItems`;

function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return "Unauthorized error.";
    case 403:
      return "Forbidden error.";
    default:
      return "There was an error retrieving the project(s). Please try again.";
  }
}

function checkStatus(response: any) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

async function parseJSON(response: Response) {
  return await response.json();
}

function convertToTodoItems(data: any[]): Todo[] {
  let todos: Todo[] = data.map(convertToTodoItemModel);
  return todos;
}

function convertToTodoItemModel(itemData: any) {
  if (itemData.status)
    itemData.status = convertNumberToTodoItemStatus(itemData.status);
  itemData.endAt = new Date(itemData.endAt);
  itemData.overDue = new Date() > itemData.endAt && itemData.status !== TodoItemStatus.Completed
  return new Todo(itemData);
}

function convertNumberToTodoItemStatus(statusNumber: number) {
  switch (statusNumber) {
    case 0:
      return TodoItemStatus.Active;
    case 1:
      return TodoItemStatus.Completed;
    default:
      throw new Error("Unsupported todo item status encountered.");
  }
}

const todoAPI = {
  /** Retrieves all todos from server. */
  async get() {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "text/plain",
        },
      });
      checkStatus(response);
      const data = await parseJSON(response);
                   return convertToTodoItems(data);
    } catch (error) {
      console.log("log client error " + error);
      throw new Error(
        "There was an error retrieving the todos. Please try again."
      );
    }
  },

  /** Updates given todo on the server. */
  async put(updatedTodo: Todo, completed: boolean) {
    try {
      const response = await fetch(`${url}/${updatedTodo.id}`, {
        method: "PUT",
        body: JSON.stringify({ updatedTodo }),
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      });
      checkStatus(response);
    } catch (error) {
      console.log("log client error " + error);
      throw new Error(
        "There was an error updating the todo. Please try again."
      );
    }
  },

  /** Posts new todo to the server. */
  async post(newTodo: Todo) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      });
      checkStatus(response);
      const data = await parseJSON(response);
      return convertToTodoItemModel(data);
    } catch (error) {
      console.log("log client error " + error);
      throw new Error("There was an error adding the todo. Please try again.");
    }
  },

  /**Deletes given todo on the server. */
  async delete(todoToDelete: Todo) {
    try {
      const response = await fetch(`${url}/${todoToDelete.id}`, {
        method: "DELETE",
      });
      checkStatus(response);
    } catch (error) {
      console.log("log client error " + error);
      throw new Error(
        "There was an error deleting the todo. Please try again."
      );
    }
  },
};

export { todoAPI };
