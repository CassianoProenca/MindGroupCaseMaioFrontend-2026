import { Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/AppShell"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { ArticleDetailPage } from "@/pages/ArticleDetailPage"
import { ArticlesPage } from "@/pages/ArticlesPage"
import { AuthPage } from "@/pages/AuthPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { HomePage } from "@/pages/HomePage"
import { SettingsPage } from "@/pages/SettingsPage"
import { UpsertArticlePage } from "@/pages/UpsertArticlePage"

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="artigos" element={<ArticlesPage />} />
        <Route path="artigos/:id" element={<ArticleDetailPage />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="cadastro" element={<AuthPage mode="register" />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="artigos/novo"
          element={
            <ProtectedRoute>
              <UpsertArticlePage mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="artigos/:id/editar"
          element={
            <ProtectedRoute>
              <UpsertArticlePage mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="configuracoes"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
