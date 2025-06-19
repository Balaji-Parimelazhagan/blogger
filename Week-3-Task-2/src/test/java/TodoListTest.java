import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.util.List;

public class TodoListTest {
    private TodoList todoList;

    @Before
    public void setUp() {
        todoList = new TodoList();
    }

    @Test
    public void testAddTask() {
        todoList.addTask("Buy milk");
        List<TodoTask> tasks = todoList.getAllTasks();
        assertEquals(1, tasks.size());
        assertEquals("Buy milk", tasks.get(0).getDescription());
        assertFalse(tasks.get(0).isCompleted());
    }

    @Test
    public void testAddDuplicateTask() {
        todoList.addTask("Buy milk");
        todoList.addTask("Buy milk");
        List<TodoTask> tasks = todoList.getAllTasks();
        assertEquals(1, tasks.size()); // Should not add duplicate
    }

    @Test
    public void testCompleteTask() {
        todoList.addTask("Buy milk");
        todoList.completeTask("Buy milk");
        List<TodoTask> tasks = todoList.getAllTasks();
        assertTrue(tasks.get(0).isCompleted());
    }

    @Test
    public void testCompleteNonExistentTask() {
        todoList.completeTask("Non-existent");
        // Should not throw, nothing happens
        assertTrue(todoList.getAllTasks().isEmpty());
    }

    @Test
    public void testCompleteAlreadyCompletedTask() {
        todoList.addTask("Buy milk");
        todoList.completeTask("Buy milk");
        todoList.completeTask("Buy milk"); // Should remain completed
        List<TodoTask> tasks = todoList.getAllTasks();
        assertTrue(tasks.get(0).isCompleted());
    }

    @Test
    public void testDeleteTask() {
        todoList.addTask("Buy milk");
        todoList.deleteTask("Buy milk");
        assertTrue(todoList.getAllTasks().isEmpty());
    }

    @Test
    public void testDeleteNonExistentTask() {
        todoList.deleteTask("Non-existent");
        // Should not throw, nothing happens
        assertTrue(todoList.getAllTasks().isEmpty());
    }

    @Test
    public void testListTasks() {
        todoList.addTask("Buy milk");
        todoList.addTask("Walk dog");
        List<TodoTask> tasks = todoList.getAllTasks();
        assertEquals(2, tasks.size());
        assertEquals("Buy milk", tasks.get(0).getDescription());
        assertEquals("Walk dog", tasks.get(1).getDescription());
    }

    @Test
    public void testListTasksAfterOperations() {
        todoList.addTask("Buy milk");
        todoList.addTask("Walk dog");
        todoList.completeTask("Buy milk");
        todoList.deleteTask("Walk dog");
        List<TodoTask> tasks = todoList.getAllTasks();
        assertEquals(1, tasks.size());
        assertEquals("Buy milk", tasks.get(0).getDescription());
        assertTrue(tasks.get(0).isCompleted());
    }
} 