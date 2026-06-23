import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import QuizPage from "../pages/QuizPage/QuizPage";
import QuizSetupPage from "../pages/QuizSetupPage/QuizSetupPage";
import AvailableQuizzesPage from "../pages/AvailableQuizzesPage/AvailableQuizzesPage";
import QuestionBankPage from "../pages/QuestionBankPage/QuestionBankPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ResultPage from "../pages/ResultPage/ResultPage";
import HistoryPage from "../pages/HistoryPage/HistoryPage";
import SubmissionDetailPage from "../pages/SubmissionDetailPage/SubmissionDetailPage";
import CandidateDashboard from "../pages/CandidateDashboard/CandidateDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import ManageQuestionsPage from "../pages/admin/ManageQuestions/ManageQuestionsPage";
import ManageQuizzesPage from "../pages/admin/ManageQuizzes/ManageQuizzesPage";
import ReviewSubmissionsPage from "../pages/admin/ReviewSubmissions/ReviewSubmissionsPage";
import ReviewSubmissionDetailPage from "../pages/admin/ReviewSubmissionDetail/ReviewSubmissionDetailPage";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route
        path="dashboard"
        element={<PrivateRoute><CandidateDashboard /></PrivateRoute>}
      />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="questions" element={<QuestionBankPage />} />
      <Route
        path="quizzes"
        element={<PrivateRoute><AvailableQuizzesPage /></PrivateRoute>}
      />
      <Route
        path="quiz/setup"
        element={<PrivateRoute><QuizSetupPage /></PrivateRoute>}
      />
      <Route
        path="quiz/:quizId"
        element={<PrivateRoute><QuizPage /></PrivateRoute>}
      />
      <Route
        path="result"
        element={<PrivateRoute><ResultPage /></PrivateRoute>}
      />
      <Route
        path="history"
        element={<PrivateRoute><HistoryPage /></PrivateRoute>}
      />
      <Route
        path="history/:id"
        element={<PrivateRoute><SubmissionDetailPage /></PrivateRoute>}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route
      path="admin"
      element={
        <RoleRoute roles={["admin"]}>
          <AdminLayout />
        </RoleRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="questions" element={<ManageQuestionsPage />} />
      <Route path="quizzes" element={<ManageQuizzesPage />} />
      <Route path="submissions" element={<ReviewSubmissionsPage />} />
      <Route path="submissions/:id" element={<ReviewSubmissionDetailPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
