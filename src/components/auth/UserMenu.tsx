import { useEffect, useRef, useState } from "react"
import { Bookmark, ChevronDown, FolderTree, LayoutDashboard, LogOut, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar } from "@/components/ui/Avatar"
import { useAuth } from "@/context/AuthContext"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  if (!user) {
    return null
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={isOpen ? "user-menu open" : "user-menu"}>
      <button
        type="button"
        className="avatar-button"
        aria-label="Menu do usuario"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Avatar name={user.name} url={user.avatarUrl} />
        <ChevronDown size={14} className="user-menu-chevron" aria-hidden="true" />
      </button>
      <div className="user-dropdown" role="menu">
        <div className="user-summary">
          <Avatar name={user.name} url={user.avatarUrl} />
          <div>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
        </div>
        <Link to="/dashboard" role="menuitem" onClick={close}>
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
        <Link to="/salvos" role="menuitem" onClick={close}>
          <Bookmark size={16} />
          Salvos
        </Link>
        <Link to="/categorias" role="menuitem" onClick={close}>
          <FolderTree size={16} />
          Categorias
        </Link>
        <Link to="/configuracoes" role="menuitem" onClick={close}>
          <Settings size={16} />
          Configuracoes
        </Link>
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            close()
            logout()
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  )
}
