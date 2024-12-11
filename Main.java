import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

class Element implements Comparable<Element> {

    int depth = 0;
    int totalModules = 0;
    int iterations = 0;

    double fitness = 0;

    HashMap<String, Teacher> subjectTeacher = new HashMap<>();
    HashMap<String, List<Student>> subjectStudents = new HashMap<>();
    List<Student> students = new ArrayList<>();
    List<Subject> subjects = new ArrayList<>();
    List<Teacher> teachers = new ArrayList<>();
    String[][][] timeTable = new String[5][5][6];

    public Element(List<Student> students, List<Subject> subjects, List<Teacher> teachers, int totalModules) {
        // Deep copy of students
        for (Student student : students) {
            this.students.add(new Student(student));
        }

        // Deep copy of subjects
        for (Subject subject : subjects) {
            this.subjects.add(new Subject(subject));
        }

        // Deep copy of teachers
        for (Teacher teacher : teachers) {
            this.teachers.add(new Teacher(teacher));
        }

        // Initialize subject -> teacher map
        for (Teacher teacher : this.teachers) {
            for (String subjectName : teacher.subjects) {
                subjectTeacher.put(subjectName, teacher);
            }
        }

        // Initialize subject -> students map
        for (Subject subject : this.subjects) {
            List<Student> enrolledStudents = new ArrayList<>();
            for (Student student : this.students) {
                if (student.subjects.contains(subject.name)) {
                    enrolledStudents.add(student);
                }
            }
            subjectStudents.put(subject.name, enrolledStudents);
        }

        this.totalModules = totalModules;
    }

    String[][][] recordedTimeTable;
    List<Subject> recordedSubjectList;
    List<Teacher> recordedTeacherList;
    List<Student> recordedStudentList;

    public void run() {
        //subjects.sort(Comparator.comparingInt((Subject s) -> s.periods).reversed());
        //Collections.shuffle(subjects);

        boolean filledWithConsecutive = this.fillConsecutive(0, 0);
        if (filledWithConsecutive)
            return;

        this.replaceValues();

        iterations = 0;
        boolean filledWithNonConsecutive = this.fillNonConsecutive(depth, 0);
        if (filledWithNonConsecutive)
            return;


        this.replaceValues();
    }

    private boolean fillNonConsecutive(int used, int skipped) {
        if (used > depth) {
            depth = used;
            recordedTimeTable = new String[5][5][6];
            recordedSubjectList = new ArrayList<>();
            recordedTeacherList = new ArrayList<>();
            recordedStudentList = new ArrayList<>();

            for (int i = 0; i < 5; i++)
                for (int j = 0; j < 5; j++)
                    System.arraycopy(timeTable[i][j], 0, recordedTimeTable[i][j], 0, 6);

            for (Subject subject : subjects)
                recordedSubjectList.add(new Subject(subject));

            for (Teacher teacher : teachers)
                recordedTeacherList.add(new Teacher(teacher));

            for (Student student : students)
                recordedStudentList.add(new Student(student));
        }
        if (used == totalModules) {
            return true;
        }
        if (iterations++ > 200)
            return false;

        int[] location = getLocation();
        for (Subject subject : subjects) {
            if (subject.periods == 0)
                continue;
            if (!validNonConsecutive(location, subject))
                continue;

            Teacher teacher = subjectTeacher.get(subject.name);
            List<Student> studentList = subjectStudents.get(subject.name);

            timeTable[location[0]][location[1]][location[2]] = subject.name;
            subject.periods--;

            teacher.availability[location[0]][location[1]] = false;
            for (Student student : studentList)
                student.availability[location[0]][location[1]] = false;

            if (fillNonConsecutive(used + 1, skipped))
                return true;

            timeTable[location[0]][location[1]][location[2]] = null;
            subject.periods++;

            teacher.availability[location[0]][location[1]] = true;
            for (Student student : studentList)
                student.availability[location[0]][location[1]] = true;

        }

        if ((5 * 5 * 6) - used - skipped >= totalModules - used) {
            timeTable[location[0]][location[1]][location[2]] = "xxxxxx";
            if (fillNonConsecutive(used, skipped + 1)) return true;
            timeTable[location[0]][location[1]][location[2]] = null;
        }
        return false;
    }

    private void replaceValues() {
        for (int i = 0; i < recordedSubjectList.size(); i++)
            subjects.get(i).periods = recordedSubjectList.get(i).periods;

        for (int i = 0; i < recordedStudentList.size(); i++)
            students.get(i).availability = recordedStudentList.get(i).availability;

        for (int i = 0; i < recordedTeacherList.size(); i++)
            teachers.get(i).availability = recordedTeacherList.get(i).availability;

        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                for (int k = 0; k < 6; k++) {
                    timeTable[i][j][k] = recordedTimeTable[i][j][k];
                    if ("xxxxxx".equals(timeTable[i][j][k]))
                        timeTable[i][j][k] = null;
                }
            }
        }
    }

    private boolean fillConsecutive(int used, int skipped) {
        if (used > depth) {
            depth = used;
            recordedTimeTable = new String[5][5][6];
            recordedSubjectList = new ArrayList<>();
            recordedTeacherList = new ArrayList<>();
            recordedStudentList = new ArrayList<>();

            for (int i = 0; i < 5; i++)
                for (int j = 0; j < 5; j++)
                    System.arraycopy(timeTable[i][j], 0, recordedTimeTable[i][j], 0, 6);

            for (Subject subject : subjects)
                recordedSubjectList.add(new Subject(subject));

            for (Teacher teacher : teachers)
                recordedTeacherList.add(new Teacher(teacher));

            for (Student student : students)
                recordedStudentList.add(new Student(student));
        }
        if (used == totalModules) {
            return true;
        }
        if (iterations++ > 200)
            return false;

        int[] location = getLocation();
        for (Subject subject : subjects) {
            if (subject.periods == 0)
                continue;
            if (5 - location[1] < subject.consecutive)
                continue;
            if (subject.periods < subject.consecutive)
                continue;
            if (!validConsecutive(location, subject))
                continue;

            Teacher teacher = subjectTeacher.get(subject.name);
            List<Student> studentList = subjectStudents.get(subject.name);

            for (int period = location[1]; period < location[1] + subject.consecutive; period++) {
                timeTable[location[0]][period][location[2]] = subject.name;
                subject.periods--;

                teacher.availability[location[0]][period] = false;
                for (Student student : studentList)
                    student.availability[location[0]][period] = false;
            }

            if (fillConsecutive(used + subject.consecutive, skipped))
                return true;

            for (int period = location[1]; period < location[1] + subject.consecutive; period++) {
                timeTable[location[0]][period][location[2]] = null;
                subject.periods++;

                teacher.availability[location[0]][period] = true;
                for (Student student : studentList)
                    student.availability[location[0]][period] = true;
            }
        }

        if ((5 * 5 * 6) - used - skipped >= totalModules - used) {
            timeTable[location[0]][location[1]][location[2]] = "xxxxxx";
            if (fillConsecutive(used, skipped + 1)) return true;
            timeTable[location[0]][location[1]][location[2]] = null;
        }
        return false;
    }

    private boolean validNonConsecutive(int[] location, Subject subject) {
        Teacher teacher = subjectTeacher.get(subject.name);
        List<Student> studentList = subjectStudents.get(subject.name);

        if (teacher.hasBreakConstraint) {
            int count = 0;
            // count how many times he taught previously in day
            for (int period = 0; period < location[1]; period++) {
                for (int timeFrame = 0; timeFrame < 6; timeFrame++) {
                    String sss = timeTable[location[0]][period][timeFrame];
                    if (sss == null)
                        continue;
                    Teacher other = subjectTeacher.get(sss);
                    if (other == null)
                        continue;
                    if (teacher.name.equals(other.name))
                        count++;
                }
            }
            if (count >= 4)
                return false;
        }

        for (Student student : studentList)
            if (student.time[location[0]].equals("pm"))
                return false;

        int day = location[0];
        int startPeriod = location[1];
        int endPeriod = startPeriod + 1;


        // Ensure the subject does not exceed the allowed consecutive periods in a day
        if (endPeriod > timeTable[day].length) {
            return false; // Not enough periods in the day for this subject
        }

        for (int period = startPeriod; period < endPeriod; period++) {
            // Check teacher's availability and avoid teacher clashes
            if (!teacher.availability[day][period]) {
                return false; // Teacher is not available for this period
            }

            for (int timeFrame = 0; timeFrame < timeTable[day][period].length; timeFrame++) {
                String currentSubject = timeTable[day][period][timeFrame];

                // Check if the teacher is already teaching another subject at this timeframe
                if (currentSubject != null && !currentSubject.equals(subject.name)) {
                    Teacher assignedTeacher = subjectTeacher.get(currentSubject);
                    if (assignedTeacher == teacher) {
                        return false; // Teacher conflict with another subject
                    }
                }

                // Check if a student is enrolled in another subject during this timeframe
                if (currentSubject != null && !currentSubject.equals(subject.name)) {
                    List<Student> otherSubjectStudents = subjectStudents.get(currentSubject);

                    // Ensure the student list for the current subject is not null
                    if (otherSubjectStudents != null) {
                        for (Student student : studentList) {
                            if (otherSubjectStudents.contains(student)) {
                                return false; // Student conflict with another subject
                            }
                        }
                    }
                }
            }
        }
        int count = 0;
        for (int period = 0; period < 5; period++) {
            for (int timeframe = 0; timeframe < 6; timeframe++) {
                if (subject.name.equals(timeTable[location[0]][period][timeframe]))
                    count++;
            }
        }
        // If all checks pass, the consecutive placement is valid
        return count < subject.consecutive;
    }

    private boolean validConsecutive(int[] location, Subject subject) {
        Teacher teacher = subjectTeacher.get(subject.name);
        List<Student> studentList = subjectStudents.get(subject.name);
        for (Student student : studentList)
            if (student.time[location[0]].equals("pm"))
                return false;

        if (teacher.hasBreakConstraint) {
            int count = 0;
            // count how many times he taught previously in day
            for (int period = 0; period < location[1]; period++) {
                for (int timeFrame = 0; timeFrame < 6; timeFrame++) {
                    String sss = timeTable[location[0]][period][timeFrame];
                    if (sss == null)
                        continue;
                    Teacher other = subjectTeacher.get(sss);
                    if (other == null)
                        continue;
                    if (teacher.name.equals(other.name))
                        count++;
                }
            }
            if (count >= 4)
                return false;
        }

        int day = location[0];
        int startPeriod = location[1];
        int endPeriod = startPeriod + subject.consecutive;

        // check how many times subject was placed on previous day
        if (day > 0) {
            int placed = 0;
            int dday = day - 1;
            for (int period = 0; period < 5; period++) {
                for (int timeFrame = 0; timeFrame < 6; timeFrame++) {
                    if (subject.name.equals(timeTable[dday][period][timeFrame]))
                        placed++;
                }
            }
            if (placed >= 2)
                return false;
        }


        // Ensure the subject does not exceed the allowed consecutive periods in a day
        if (endPeriod > timeTable[day].length) {
            return false; // Not enough periods in the day for this subject
        }

        for (int period = startPeriod; period < endPeriod; period++) {
            // Check teacher's availability and avoid teacher clashes
            if (!teacher.availability[day][period]) {
                return false; // Teacher is not available for this period
            }

            for (int timeFrame = 0; timeFrame < timeTable[day][period].length; timeFrame++) {
                String currentSubject = timeTable[day][period][timeFrame];

                // Check if the teacher is already teaching another subject at this timeframe
                if (currentSubject != null && !currentSubject.equals(subject.name)) {
                    Teacher assignedTeacher = subjectTeacher.get(currentSubject);
                    if (assignedTeacher == teacher) {
                        return false; // Teacher conflict with another subject
                    }
                }

                // Check if a student is enrolled in another subject during this timeframe
                if (currentSubject != null && !currentSubject.equals(subject.name)) {
                    List<Student> otherSubjectStudents = subjectStudents.get(currentSubject);

                    // Ensure the student list for the current subject is not null
                    if (otherSubjectStudents != null) {
                        for (Student student : studentList) {
                            if (otherSubjectStudents.contains(student)) {
                                return false; // Student conflict with another subject
                            }
                        }
                    }
                }
            }
        }
        int count = 0;
        for (int period = 0; period < 5; period++) {
            for (int timeframe = 0; timeframe < 6; timeframe++) {
                if (subject.name.equals(timeTable[location[0]][period][timeframe]))
                    count++;
            }
        }
        // If all checks pass, the consecutive placement is valid
        return count < subject.consecutive;
    }

    private int[] getLocation() {
        int[] location = new int[3];
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                for (int k = 0; k < 6; k++) {
                    if (timeTable[i][j][k] == null)
                        return new int[]{i, j, k};
                }
            }
        }
        return location;
    }

    @Override
    public int compareTo(Element o) {
        return this.depth - o.depth;
    }

    public int fitness() {
        int fitness = 0;

        for (int day = 0; day < 5; day++) {
            HashSet<Student> studentsOfFirstPeriod = new HashSet<>();
            for (int timeFrame = 0; timeFrame < 6; timeFrame++) {
                List<Student> studentList = subjectStudents.get(timeTable[day][0][timeFrame]);
                if (studentList == null)
                    continue;
                studentsOfFirstPeriod.addAll(studentList);
            }
            for (int period = 1; period < 5; period++) {
                HashSet<Student> studentsOfThisPeriod = new HashSet<>();

                for (int timeFrame = 0; timeFrame < 6; timeFrame++) {
                    List<Student> studentList = subjectStudents.get(timeTable[day][period][timeFrame]);
                    if (studentList == null)
                        continue;
                    studentsOfThisPeriod.addAll(studentList);
                }
                for (Student student : studentsOfThisPeriod)
                    if (studentsOfFirstPeriod.contains(student))
                        fitness++;

                studentsOfFirstPeriod = studentsOfThisPeriod;
            }
        }

        return fitness;
    }
}

class Student {
    String name;
    List<String> subjects = new ArrayList<>();
    boolean[][] availability = new boolean[5][5];
    String[] time = new String[5];

    public String toString() {
        return name;
    }

    public Student() {
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                availability[i][j] = true;
            }
        }
    }

    public Student(Student student) {
        // Copy the name (Strings are immutable, so a direct copy is fine)
        this.name = student.name;

        // Deep copy of the subjects list
        this.subjects = new ArrayList<>(student.subjects);

        // Deep copy of the availability 2D array
        for (int i = 0; i < 5; i++) {
            this.availability[i] = student.availability[i].clone();
        }

        // Copy the time array
        this.time = student.time.clone();
    }
}

class Subject {
    String name;
    int periods;
    int consecutive;

    public Subject() {

    }

    public Subject(Subject subject) {
        this.name = subject.name;
        this.periods = subject.periods;
        this.consecutive = subject.consecutive;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Subject subject = (Subject) o;
        return Objects.equals(name, subject.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}

class Teacher {
    String name;
    List<String> subjects = new ArrayList<>();
    boolean[][] availability = new boolean[5][5];
    boolean hasBreakConstraint = false;

    public Teacher() {
    }

    public Teacher(Teacher t) {
        this.name = t.name;

        // Deep copy of the subjects list
        this.subjects = new ArrayList<>(t.subjects);

        // Deep copy of the 2D availability array
        for (int i = 0; i < 5; i++) {
            this.availability[i] = t.availability[i].clone(); // Clone each inner array
        }

        this.hasBreakConstraint = t.hasBreakConstraint;
    }

}

public class Main {

    static HashMap<String, Teacher> subjectTeacher = new HashMap<>();
    static HashMap<String, List<Student>> subjectStudents = new HashMap<>();
    static List<Student> students = getStudents("Students.txt");
    static List<Subject> subjects = getSubjects("Subjects.txt");
    static List<Teacher> teachers = getTeachers("Teachers.txt");

    public static void main(String[] args) {
        int totalModules = 0;
        for (Subject subject : subjects) {
            totalModules += subject.periods;
        }

        Element[] population = new Element[250];
        for (int i = 0; i < population.length; i++) {
            population[i] = new Element(students, subjects, teachers, totalModules);
            population[i].subjects.sort(Comparator.comparingInt((Subject s) -> s.periods).reversed());
            Collections.shuffle(population[i].subjects);
        }

        List<Element> best = new ArrayList<>();
        int generation = 1;
        while (generation < 50) {
            for (Element element : population)
                element.run();

            int maxScore = -1;
            Element highest = null;
            for (Element element : population)
                if (element.depth > maxScore) {
                    maxScore = element.depth;
                    highest = element;
                }

            System.out.println(highest.depth + ":" + generation++);
            best.add(highest);

            double sum = 0;
            for (Element element : population)
                sum += element.depth;

            for (Element element : population)
                element.fitness = ((double) element.depth) / sum;

            Element[] newPopulation = new Element[population.length];
            for (int i = 0; i < population.length; i++) {
                if (Math.random() < 0.1) {
                    newPopulation[i] = new Element(students, subjects, teachers, totalModules);
                    Collections.shuffle(newPopulation[i].subjects);
                    continue;
                }
                newPopulation[i] = crossover(pickOne(population), pickOne(population));
                if (Math.random() < 0.1) {
                    List<Subject> toShuffle = newPopulation[i].subjects;
                    for (int j = 0; j < toShuffle.size() / 3; j++) {
                        int index1 = (int) (Math.random() * toShuffle.size());
                        int index2;
                        do {
                            index2 = (int) (Math.random() * toShuffle.size());
                        } while (index1 == index2); // Ensure the indices are distinct

                        // Perform the swap
                        Collections.swap(toShuffle, index1, index2);
                    }
                }
            }
            population = newPopulation;
        }
        int max = -1;
        for (Element element : best) {
            max = Math.max(max, element.depth);
        }

        for (int i = best.size() - 1; i >= 0; i--)
            if (best.get(i).depth < max)
                best.remove(i);

        int[] scores = new int[best.size()];
        for (int i = 0; i < scores.length; i++)
            scores[i] = best.get(i).fitness();

        int index = -1;
        int maxScore = -1;
        for (int i = 0; i < scores.length; i++) {
            if (scores[i] > maxScore) {
                index = i;
                maxScore = scores[i];
            }
        }
        System.out.println("\nChose best solution out of " + scores.length + ".");
        System.out.println(best.get(index).depth + "/" + best.get(index).totalModules + " placed.");
        for (Subject subject : best.get(index).recordedSubjectList) {
            if (subject.periods > 0)
                System.out.println(subject.name + ": " + subject.periods);
        }
        printTimeTable(best.get(index).recordedTimeTable);
    }

    private static Element crossover(Element element0, Element element1) {
        // Make element0 always be the biggest in terms of fitness
        if (element0.fitness < element1.fitness) {
            Element temp = element0;
            element0 = element1;
            element1 = temp;
        }

        // Get the subjects from both elements
        List<Subject> subjects0 = element0.subjects;
        List<Subject> subjects1 = element1.subjects;

        // Create a new list for the offspring's subjects
        List<Subject> newSubjectList = new ArrayList<>();
        Set<Subject> addedSubjects = new HashSet<>();

        // Take the first half of subjects from element0
        int halfSize = subjects0.size() / 2;
        for (int i = 0; i < halfSize; i++) {
            Subject subject = subjects0.get(i);
            newSubjectList.add(subject);
            addedSubjects.add(subject);
        }

        // Fill the remaining subjects from element1, avoiding duplicates
        for (Subject subject : subjects1) {
            if (!addedSubjects.contains(subject))
                newSubjectList.add(subject);
        }

        for (Subject subject : newSubjectList)
            for (Subject subject1 : subjects)
                if(subject.name.equals(subject1.name))
                    subject.periods = subject1.periods;

        // Return a new Element combining subjects and other properties
        return new Element(students, newSubjectList, teachers, element0.totalModules);
    }


    private static Element pickOne(Element[] population) {
        int index = 0;
        double r = Math.random();

        while(r > 0) {
            r = r - population[index].fitness;
            index++;
        }
        index--;
        return population[index];
    }

    public static void printTimeTable(String[][][] timeTable) {
        for (int i = 0; i < timeTable.length; i++) {
            if (i == 0)
                System.out.println("\t\t\t\tMonday");
            if (i == 1)
                System.out.println("\t\t\t\tTuesday");
            if (i == 2)
                System.out.println("\t\t\t\tWednesday");
            if (i == 3)
                System.out.println("\t\t\t\tThursday");
            if (i == 4)
                System.out.println("\t\t\t\tFriday");
            for (int j = 0; j < timeTable[i].length; j++) {
                System.out.println(Arrays.toString(timeTable[i][j]) + ", Period: " + (j + 1));
            }
            System.out.println();
        }
    }

    private static List<Teacher> getTeachers(String filePath) {
        List<Teacher> teachers = new ArrayList<>();
        try {
            Scanner scanner = new Scanner(new File(filePath));
            while (scanner.hasNextLine()) {
                String[] data = scanner.nextLine().split(",");
                Teacher teacher = new Teacher();
                teacher.name = data[0];
                for (int i = 1; i < data.length - 2; i++) {
                    teacher.subjects.add(data[i]);
                    subjectTeacher.put(data[i], teacher);
                }
                String[] availability = data[data.length - 2].split(" ");
                for (int i = 0; i < availability.length; i++) {
                    if (availability[i].equals("0")) continue;
                    for (int j = 0; j < availability[i].length(); j++) {
                        int av = availability[i].charAt(j) - '0' - 1;
                        teacher.availability[i][av] = true;
                    }
                }
                if (data[data.length - 1].equals("1"))
                    teacher.hasBreakConstraint = true;

                teachers.add(teacher);
            }
            scanner.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return teachers;
    }

    private static List<Subject> getSubjects(String filePath) {
        List<Subject> subjects = new ArrayList<>();
        try {
            Scanner scanner = new Scanner(new File(filePath));
            while (scanner.hasNextLine()) {
                String[] data = scanner.nextLine().split(",");
                Subject subject = new Subject();
                subject.name = data[0];
                subject.periods = Integer.parseInt(data[1]);
                subject.consecutive = Integer.parseInt(data[2]);
                subjects.add(subject);
            }
            scanner.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return subjects;
    }

    private static List<Student> getStudents(String filePath) {
        List<Student> students = new ArrayList<>();
        try {
            Scanner scanner = new Scanner(new File(filePath));
            while (scanner.hasNextLine()) {
                String[] data = scanner.nextLine().split(",");
                Student student = new Student();
                student.name = data[0];
                for (int i = 1; i < data.length - 1; i++) {
                    student.subjects.add(data[i]);
                    subjectStudents.computeIfAbsent(data[i], k -> new ArrayList<>()).add(student);
                }
                student.time = data[data.length - 1].split(" ");

                students.add(student);
            }
            scanner.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return students;
    }
}