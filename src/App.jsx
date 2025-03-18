import React from 'react';
import Home from './Home';
import AdminLayout from './layout/teacher';
import GenerateTasks from './components/GenerateTasks';
import StudentResponse from './components/StudentResponse';
import StudentLayout from './layout/student';
import StudentTests from './components/StudentTests';
import StudentDashboard from './components/StudentDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SubjectTestsPage from './pages/SubjectTestsPage';

const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<AdminLayout />}>
          <Route index element={<GenerateTasks />} />
          <Route path="answers" element={<StudentResponse />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentTests />} />
          <Route path=":subject" element={<SubjectTestsPage />} />
          {/* <Route index element={<StudentDashboard />} /> */}
        </Route>
      </Routes>
 
  );
};

export default App;
