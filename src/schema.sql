-- Drop tables if they exist
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Create Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    department VARCHAR(100) NOT NULL
);

-- Create Faculty table
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL
);

-- Create Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    credits INT NOT NULL,
    faculty_id INT REFERENCES faculty(id) ON DELETE SET NULL
);

-- Create Enrollments table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, course_id)
);

-- Create Grades table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    grade VARCHAR(2) NOT NULL,
    marks INT NOT NULL CHECK (marks >= 0 AND marks <= 100),
    updated_by INT REFERENCES faculty(id) ON DELETE SET NULL,
    date_updated DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, course_id)
);

-- Create Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(10) CHECK (status IN ('Present', 'Absent')),
    UNIQUE(student_id, course_id, date)
);

-- Insert Sample Data
INSERT INTO students (name, email, department) VALUES
('Rohan Sharma', 'rohan@student.com', 'Computer Science'),
('Priya Patel', 'priya@student.com', 'Information Technology'),
('Amit Verma', 'amit@student.com', 'Electronics'),
('Sneha Reddy', 'sneha@student.com', 'Computer Science');

INSERT INTO faculty (name, email, department) VALUES
('Dr. Alan Turing', 'alan@faculty.com', 'Computer Science'),
('Dr. Grace Hopper', 'grace@faculty.com', 'Information Technology'),
('Dr. Richard Feynman', 'richard@faculty.com', 'Electronics');

INSERT INTO courses (course_name, course_code, credits, faculty_id) VALUES
('Data Structures and Algorithms', 'CS101', 4, 1),
('Database Management Systems', 'IT102', 3, 2),
('Web Engineering', 'CS202', 3, 1),
('Digital Signal Processing', 'EC301', 4, 3);

INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1), -- Rohan enrolled in DSA
(1, 2), -- Rohan enrolled in DBMS
(1, 3), -- Rohan enrolled in Web Eng
(2, 2), -- Priya enrolled in DBMS
(3, 4), -- Amit enrolled in DSP
(4, 1); -- Sneha enrolled in DSA

INSERT INTO grades (student_id, course_id, grade, marks, updated_by) VALUES
(1, 1, 'A', 92, 1),
(1, 2, 'B+', 85, 2),
(2, 2, 'A+', 96, 2);

INSERT INTO attendance (student_id, course_id, date, status) VALUES
(1, 1, '2026-06-25', 'Present'),
(1, 1, '2026-06-26', 'Present'),
(1, 1, '2026-06-27', 'Absent'),
(1, 2, '2026-06-26', 'Present'),
(2, 2, '2026-06-26', 'Present');
