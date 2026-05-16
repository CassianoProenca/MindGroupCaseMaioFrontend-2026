import { FolderTree, LayoutDashboard, LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar } from "@/components/ui/Avatar"
import { useAuth } from "@/context/AuthContext"

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="user-menu">
      <button type="button" className="avatar-button" aria-label="Menu do usuario">
        <Avatar name={user.name} url={user.avatarUrl} />
      </button>
      <div className="user-dropdown">
        <div className="user-summary">
          <Avatar name={user.name} url={user.avatarUrl} />
          <div>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
        </div>
        <Link to="/dashboard">
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <Link to="/categorias">
          <FolderTree size={16} />
          Categorias
        </Link>
        <Link to="/configuracoes">
          <Settings size={16} />
          Configuracoes
        </Link>
        <button type="button" onClick={logout}>
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  )
}
