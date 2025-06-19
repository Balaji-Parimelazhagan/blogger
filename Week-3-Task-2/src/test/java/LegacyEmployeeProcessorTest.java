import org.junit.Test;
import org.junit.Before;
import static org.junit.Assert.*;
import java.util.*;

public class LegacyEmployeeProcessorTest {
    private LegacyEmployeeProcessor processor;

    @Before
    public void setUp() {
        processor = new LegacyEmployeeProcessor();
    }

    @Test
    public void testProcessEmployeeData_NormalCase() {
        List<Map<String, Object>> rawData = new ArrayList<>();
        rawData.add(createEmployeeMap(1, "Alice", "IT", 60000.0));
        rawData.add(createEmployeeMap(2, "Bob", "HR", 55000.0));
        rawData.add(createEmployeeMap(3, "Charlie", "Finance", 40000.0)); // Should be filtered out

        List<Employee> result = processor.processEmployeeData(rawData);
        assertEquals(2, result.size());
        assertEquals("Alice", result.get(0).getName()); // Sorted by salary desc
        assertEquals("Bob", result.get(1).getName());
        assertEquals(60000.0 * 0.15, result.get(0).getBonus(), 0.001);
        assertEquals(55000.0 * 0.10, result.get(1).getBonus(), 0.001);
    }

    @Test
    public void testProcessEmployeeData_EmptyList() {
        List<Employee> result = processor.processEmployeeData(new ArrayList<>());
        assertTrue(result.isEmpty());
    }

    @Test
    public void testProcessEmployeeData_ErrorHandling() {
        List<Map<String, Object>> rawData = new ArrayList<>();
        Map<String, Object> badData = new HashMap<>();
        badData.put("id", "notAnInt"); // Wrong type
        badData.put("name", null);
        badData.put("department", null);
        badData.put("salary", null);
        rawData.add(badData);
        // Should not throw, just print error
        List<Employee> result = processor.processEmployeeData(rawData);
        assertTrue(result.isEmpty());
    }

    @Test
    public void testCalculateDepartmentAverages_NormalCase() {
        // Add employees to processor's list
        Employee e1 = new Employee();
        e1.setId(1); e1.setName("A"); e1.setDepartment("IT"); e1.setSalary(60000.0);
        Employee e2 = new Employee();
        e2.setId(2); e2.setName("B"); e2.setDepartment("IT"); e2.setSalary(80000.0);
        Employee e3 = new Employee();
        e3.setId(3); e3.setName("C"); e3.setDepartment("HR"); e3.setSalary(50000.0);
        processor.employees.add(e1);
        processor.employees.add(e2);
        processor.employees.add(e3);

        Map<String, Double> avgs = processor.calculateDepartmentAverages();
        assertEquals(2, avgs.size());
        assertEquals((60000.0 + 80000.0) / 2, avgs.get("IT"), 0.001);
        assertEquals(50000.0, avgs.get("HR"), 0.001);
    }

    @Test
    public void testCalculateDepartmentAverages_Empty() {
        Map<String, Double> avgs = processor.calculateDepartmentAverages();
        assertTrue(avgs.isEmpty());
    }

    @Test
    public void testEmployeeGettersSetters() {
        Employee e = new Employee();
        e.setId(10);
        e.setName("Test");
        e.setDepartment("QA");
        e.setSalary(12345.67);
        e.setBonus(100.0);
        assertEquals(10, e.getId());
        assertEquals("Test", e.getName());
        assertEquals("QA", e.getDepartment());
        assertEquals(12345.67, e.getSalary(), 0.001);
        assertEquals(100.0, e.getBonus(), 0.001);
    }

    // Helper to create employee map
    private Map<String, Object> createEmployeeMap(int id, String name, String dept, double salary) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        map.put("name", name);
        map.put("department", dept);
        map.put("salary", salary);
        return map;
    }
} 