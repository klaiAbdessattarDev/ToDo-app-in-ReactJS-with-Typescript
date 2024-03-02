export enum TodoItemStatus {
  Active = "Active",
  Completed = "Completed",
}

export class Todo {
  id: number | undefined;
  name: string = "";
  endAt: Date | undefined;
  status: TodoItemStatus = TodoItemStatus.Active;
  overDue: boolean = false;

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.name) this.name = initializer.name;
    if (initializer.endAt) this.endAt = initializer.endAt;
    if (initializer.status) this.status = initializer.status;
    if (initializer.overDue) this.overDue = initializer.overDue;
  }

  ConvertStatusToNumber(todoStatus: TodoItemStatus) {
    switch (todoStatus) {
      case TodoItemStatus.Active:
        return 0;
      case TodoItemStatus.Completed:
        return 1;
    }
  }

  /** Explicit to JSON conversion required for proper handling of the enum field value. */
  toJSON(): {
    name: string;
    id: number | undefined;
    endAt: string | undefined;
    status: number;
  } {
    return {
      name: this.name,
      id: this.id,
      endAt: this.endAt?.toISOString().slice(0,19) || '',
      status: this.ConvertStatusToNumber(this.status),
    };
  }
}
