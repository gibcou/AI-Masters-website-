export default function CourseLayout({ children }) {
  return children;
}

export function generateStaticParams() {
  try {
    // Import locally to avoid client component constraints
    const { getAllCourses } = require("@/lib/courses");
    const courses = getAllCourses();
    return courses.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}