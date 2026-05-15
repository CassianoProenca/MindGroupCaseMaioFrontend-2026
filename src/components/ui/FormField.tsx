import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react"

type FieldShellProps = {
  label: string
  hint?: string
  action?: ReactNode
  children: ReactNode
}

function FieldShell({ label, hint, action, children }: FieldShellProps) {
  return (
    <label className="field-shell">
      <span className="field-label-row">
        <span>{label}</span>
        {action}
      </span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  action?: ReactNode
}

export function TextInput({ label, hint, action, ...props }: TextInputProps) {
  return (
    <FieldShell label={label} hint={hint} action={action}>
      <input className="text-field" {...props} />
    </FieldShell>
  )
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: string
  action?: ReactNode
}

export function TextArea({ label, hint, action, ...props }: TextAreaProps) {
  return (
    <FieldShell label={label} hint={hint} action={action}>
      <textarea className="text-field text-area" {...props} />
    </FieldShell>
  )
}
