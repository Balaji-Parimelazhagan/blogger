import java.util.*;

public class LegacyEmployeeProcessor {
    List<Employee> employees;
    
    public LegacyEmployeeProcessor() {
        this.employees = new ArrayList<>();
    }
    
    public List<Employee> processEmployeeData(List<Map<String, Object>> rawData) {
        List<Employee> processedEmployees = new ArrayList<>();
        
        for (Map<String, Object> data : rawData) {
            try {
                Employee employee = new Employee();
                employee.setId((Integer) data.get("id"));
                employee.setName((String) data.get("name"));
                employee.setDepartment((String) data.get("department"));
                employee.setSalary((Double) data.get("salary"));
                
                // Calculate bonus based on department and salary
                double bonus = 0.0;
                if (employee.getDepartment().equals("IT")) {
                    bonus = employee.getSalary() * 0.15;
                } else if (employee.getDepartment().equals("HR")) {
                    bonus = employee.getSalary() * 0.10;
                } else {
                    bonus = employee.getSalary() * 0.05;
                }
                employee.setBonus(bonus);
                
                // Add to processed list if salary is above threshold
                if (employee.getSalary() > 50000) {
                    processedEmployees.add(employee);
                }
            } catch (Exception e) {
                System.out.println("Error processing employee: " + e.getMessage());
            }
        }
        
        // Sort employees by salary
        Collections.sort(processedEmployees, new Comparator<Employee>() {
            @Override
            public int compare(Employee e1, Employee e2) {
                return Double.compare(e2.getSalary(), e1.getSalary());
            }
        });
        
        return processedEmployees;
    }
    
    public Map<String, Double> calculateDepartmentAverages() {
        Map<String, Double> departmentAverages = new HashMap<>();
        Map<String, List<Double>> departmentSalaries = new HashMap<>();
        
        for (Employee emp : employees) {
            String dept = emp.getDepartment();
            if (!departmentSalaries.containsKey(dept)) {
                departmentSalaries.put(dept, new ArrayList<>());
            }
            departmentSalaries.get(dept).add(emp.getSalary());
        }
        
        for (Map.Entry<String, List<Double>> entry : departmentSalaries.entrySet()) {
            double sum = 0.0;
            for (Double salary : entry.getValue()) {
                sum += salary;
            }
            departmentAverages.put(entry.getKey(), sum / entry.getValue().size());
        }
        
        return departmentAverages;
    }
}

class Employee {
    private int id;
    private String name;
    private String department;
    private double salary;
    private double bonus;
    
    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }
    
    public double getBonus() { return bonus; }
    public void setBonus(double bonus) { this.bonus = bonus; }
} 