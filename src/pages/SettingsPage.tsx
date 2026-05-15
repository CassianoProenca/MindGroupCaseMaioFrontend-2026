import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { ArrowLeft, Mail, User } from "lucide-react"
import { Link } from "react-router-dom"

import { TextArea, TextInput } from "@/components/ui/FormField"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { formatDate } from "@/lib/format"
import { getApiErrorMessage } from "@/services/api"
import { getMyProfile, updateMyProfile } from "@/services/profile"
import type { Profile } from "@/types/api"

export function SettingsPage() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState(user?.name ?? "")
  const [bio, setBio] = useState(user?.bio ?? "")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "")
  const [isLoading, setIsLoading] = useState(Boolean(token))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!token) {
      return
    }

    getMyProfile(token)
      .then(({ profile }) => {
        setProfile(profile)
        setName(profile.name)
        setBio(profile.bio ?? "")
        setAvatarUrl(profile.avatarUrl ?? "")
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setIsLoading(false))
  }, [token])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    setError("")
    setSuccess("")
    setIsSubmitting(true)

    try {
      const response = await updateMyProfile({ name, bio, avatarUrl }, token)
      setProfile(response.profile)
      setSuccess("Perfil atualizado com sucesso.")
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const avatarInitial = name.charAt(0).toUpperCase() || "M"

  return (
    <section className="page-container narrow-page">
      <Link to="/dashboard" className="page-kicker">
        <ArrowLeft size={20} />
        Voltar ao Dashboard
      </Link>
      <div className="page-rule" />
      <h1 className="page-title">Configuracoes do Perfil</h1>
      <p className="page-subtitle">Gerencie suas informacoes pessoais</p>

      {isLoading ? (
        <StateBlock title="Carregando perfil" />
      ) : (
        <form className="settings-form surface-panel" onSubmit={handleSubmit}>
          <div className="profile-photo">
            {avatarUrl ? (
              <img className="profile-avatar-image" src={avatarUrl} alt="" />
            ) : (
              <div className="avatar-placeholder large">{avatarInitial}</div>
            )}
            <TextInput
              label="Foto de Perfil"
              name="avatarUrl"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://images.unsplash.com/..."
              hint="Adicione uma imagem ou deixe em branco"
            />
          </div>
          <div className="icon-field">
            <User size={20} />
            <TextInput
              label="Nome Completo"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
            />
          </div>
          <div className="icon-field">
            <Mail size={20} />
            <TextInput label="Email" value={profile?.email ?? user?.email ?? ""} readOnly />
          </div>
          <TextArea
            label="Bio"
            name="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={500}
            hint={`${bio.length}/500 caracteres`}
          />
          <div className="account-info">
            <strong>Informacoes da conta</strong>
            <div>
              <span>Tipo de conta</span>
              <p>{profile?.role ?? "author"}</p>
            </div>
            <div>
              <span>Membro desde</span>
              <p>{profile?.createdAt ? formatDate(profile.createdAt) : "-"}</p>
            </div>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}
          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alteracoes"}
          </button>
        </form>
      )}
    </section>
  )
}
