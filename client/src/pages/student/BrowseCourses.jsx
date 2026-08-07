import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { viewAllCourses } from '../../services/courseService.js';

function BrowseCoursesByStudent() {
let [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchAllCourses();
  }, []);

    const fetchAllCourses = async () => {
      try {
        const response = await viewAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <>
      <h3>Browse Courses</h3>
      <table border="1">
        <thead>
          <tr>
          <th>Course ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Faculty</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course._id}</td>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.faculty}</td>
              <td>{course.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default BrowseCoursesByStudent;

