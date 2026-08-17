export interface Student {
    id: string;
    name: string;
    email: string;
    course: string;
    status: 'Active' | 'Pending' | 'Suspended';
    enrollmentDate: string;
}

export interface Course {
    id: string;
    title: string;
    department: string;
    enrolledCount: number;
    maxCapacity: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
