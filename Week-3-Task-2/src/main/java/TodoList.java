import java.util.*;

/**
 * Manages a list of to-do tasks.
 */
public class TodoList {
    private final List<TodoTask> tasks = new ArrayList<>();

    /**
     * Adds a new task if it does not already exist.
     * @param description the task description
     */
    public void addTask(String description) {
        for (TodoTask task : tasks) {
            if (task.getDescription().equals(description)) {
                return; // Duplicate, do not add
            }
        }
        tasks.add(new TodoTask(description));
    }

    /**
     * Marks the task with the given description as completed.
     * @param description the task description
     */
    public void completeTask(String description) {
        for (TodoTask task : tasks) {
            if (task.getDescription().equals(description)) {
                task.setCompleted(true);
                return;
            }
        }
    }

    /**
     * Deletes the task with the given description.
     * @param description the task description
     */
    public void deleteTask(String description) {
        Iterator<TodoTask> iterator = tasks.iterator();
        while (iterator.hasNext()) {
            TodoTask task = iterator.next();
            if (task.getDescription().equals(description)) {
                iterator.remove();
                return;
            }
        }
    }

    /**
     * Returns a copy of all tasks.
     * @return list of tasks
     */
    public List<TodoTask> getAllTasks() {
        return new ArrayList<>(tasks);
    }
} 