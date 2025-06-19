/**
 * Represents a single to-do task.
 */
public class TodoTask {
    private String description;
    private boolean completed;

    /**
     * Creates a new task with the given description.
     * @param description the task description
     */
    public TodoTask(String description) {
        this.description = description;
        this.completed = false;
    }

    /**
     * Returns the task description.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Returns true if the task is completed.
     */
    public boolean isCompleted() {
        return completed;
    }

    /**
     * Sets the completed status of the task.
     */
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    @Override
    public String toString() {
        return "TodoTask{" +
                "description='" + description + '\'' +
                ", completed=" + completed +
                '}';
    }
} 