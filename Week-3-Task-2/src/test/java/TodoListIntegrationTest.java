import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.List;

public class TodoListIntegrationTest {
    private TodoList todoList;

    @Before
    public void setUp() {
        todoList = new TodoList();
    }

    @Test
    public void testFullUserFlow() {
        // Add tasks
        todoList.addTask("Buy milk");
        todoList.addTask("Walk dog");
        todoList.addTask("Read book");
        todoList.addTask("Buy milk"); // duplicate, should not be added

        // Complete one
        todoList.completeTask("Walk dog");

        // Delete one
        todoList.deleteTask("Read book");

        // Final state
        List<TodoTask> tasks = todoList.getAllTasks();
        assertEquals(2, tasks.size());

        // Check tasks
        TodoTask task1 = tasks.get(0);
        TodoTask task2 = tasks.get(1);
        if (task1.getDescription().equals("Buy milk")) {
            assertFalse(task1.isCompleted());
            assertEquals("Walk dog", task2.getDescription());
            assertTrue(task2.isCompleted());
        } else {
            assertEquals("Walk dog", task1.getDescription());
            assertTrue(task1.isCompleted());
            assertEquals("Buy milk", task2.getDescription());
            assertFalse(task2.isCompleted());
        }
    }
} 