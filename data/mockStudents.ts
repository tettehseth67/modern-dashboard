import { Student, Course } from '../types/dashboard';

// 1. Maintain the running snapshot inside the local module scope memory
let studentsList: Student[] = [
    { id: 'STU-001', name: 'Alex Mercer', email: 'alex.m@academy.edu', course: 'Web Development Core', status: 'Active', enrollmentDate: '2026-01-15' },
    { id: 'STU-002', name: 'Sarah Connor', email: 's.connor@academy.edu', course: 'Database Management', status: 'Pending', enrollmentDate: '2026-02-10' },
    { id: 'STU-003', name: 'David Lightman', email: 'wargames@academy.edu', course: 'Cybersecurity Fundamentals', status: 'Suspended', enrollmentDate: '2026-03-01' }
];

export const MOCK_COURSES: Course[] = [
    { id: 'CRS-101', title: 'Web Development Core', department: 'Frontend Engineering', enrolledCount: 18, maxCapacity: 25, difficulty: 'Beginner' },
    { id: 'CRS-204', title: 'Database Management', department: 'Systems Architecture', enrolledCount: 12, maxCapacity: 15, difficulty: 'Intermediate' },
    { id: 'CRS-309', title: 'Cybersecurity Fundamentals', department: 'Network Security', enrolledCount: 8, maxCapacity: 20, difficulty: 'Advanced' }
];

// 2. Expose a retrieval helper function
export const getGlobalStudents = (): Student[] => {
    return studentsList;
};

// 3. Expose a deletion helper function
export const deleteGlobalStudent = (id: string): Student[] => {
    studentsList = studentsList.filter(student => student.id !== id);
    return studentsList;
};
