import { ArrowLeft, Mail, User } from "lucide-react"
import { Link } from "react-router-dom"

import { TextArea, TextInput } from "@/components/ui/FormField"
import { useAuth } from "@/context/AuthContext"

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <section className="page-container narrow-page">
      <Link to="/dashboard" className="page-kicker">
        <ArrowLeft size={20} />
        Voltar ao Dashboard
      </Link>
      <div className="page-rule" />
      <h1 className="page-title">Configuracoes do Perfil</h1>
      <p className="page-subtitle">Gerencie suas informacoes pessoais</p>

      <form className="settings-form surface-panel">
        <div className="profile-photo">
          <div className="avatar-placeholder large">{user?.name.charAt(0).toUpperCase()}</div>
          <TextInput label="Foto de Perfil" defaultValue="https://images.unsplash.com/photo-1472099645785" />
        </div>
        <div className="icon-field">
          <User size={20} />
          <TextInput label="Nome Completo" defaultValue={user?.name ?? "John Doe"} />
        </div>
        <div className="icon-field">
          <Mail size={20} />
          <TextInput label="Email" defaultValue={user?.email ?? "example@email.com"} />
        </div>
        <TextArea
          label="Bio"
          defaultValue="Desenvolvedor Full Stack apaixonado por tecnologia e inovacao."
          hint="62/500 caracteres"
        />
        <div className="account-info">
          <strong>Informacoes da conta</strong>
          <div>
            <span>Tipo de conta</span>
            <p>Admin</p>
          </div>
          <div>
            <span>Membro desde</span>
            <p>20/01/2026</p>
          </div>
        </div>
        <button type="button" className="button-primary">
          Salvar Alteracoes
        </button>
      </form>
    </section>
  )
}
