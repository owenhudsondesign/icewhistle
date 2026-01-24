'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useEmergencyContacts,
  formatPhoneNumber,
  isValidPhone,
  defaultMessages,
} from '@/hooks/use-emergency-contacts'
import { useLanguage } from '@/hooks/use-language'
import {
  UserPlus,
  X,
  Phone,
  User,
  MessageSquare,
  Shield,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
} from 'lucide-react'

const translations = {
  en: {
    title: 'Emergency Contacts',
    subtitle: 'These contacts will receive an alert when you tap "Alert My Contacts"',
    addContact: 'Add Contact',
    name: 'Name',
    phone: 'Phone Number',
    namePlaceholder: 'Mom, Lawyer, Friend...',
    phonePlaceholder: '(555) 123-4567',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    noContacts: 'No emergency contacts yet',
    noContactsDesc: 'Add trusted people who should know if you encounter ICE',
    customMessage: 'Custom Message (optional)',
    customMessagePlaceholder: 'Leave blank to use the default message',
    defaultMessagePreview: 'Default message preview:',
    privacyNote: 'Contacts are stored only on your device - never sent to our servers',
    invalidPhone: 'Please enter a valid phone number',
    maxContacts: 'Maximum 5 contacts',
  },
  es: {
    title: 'Contactos de Emergencia',
    subtitle: 'Estos contactos recibirán una alerta cuando toques "Alertar Mis Contactos"',
    addContact: 'Agregar Contacto',
    name: 'Nombre',
    phone: 'Número de Teléfono',
    namePlaceholder: 'Mamá, Abogado, Amigo...',
    phonePlaceholder: '(555) 123-4567',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    noContacts: 'Sin contactos de emergencia',
    noContactsDesc: 'Agrega personas de confianza que deban saber si encuentras a ICE',
    customMessage: 'Mensaje Personalizado (opcional)',
    customMessagePlaceholder: 'Deja en blanco para usar el mensaje predeterminado',
    defaultMessagePreview: 'Vista previa del mensaje:',
    privacyNote: 'Los contactos se guardan solo en tu dispositivo - nunca se envían a nuestros servidores',
    invalidPhone: 'Por favor ingresa un número de teléfono válido',
    maxContacts: 'Máximo 5 contactos',
  },
  pt: {
    title: 'Contatos de Emergência',
    subtitle: 'Estes contatos receberão um alerta quando você tocar em "Alertar Meus Contatos"',
    addContact: 'Adicionar Contato',
    name: 'Nome',
    phone: 'Número de Telefone',
    namePlaceholder: 'Mãe, Advogado, Amigo...',
    phonePlaceholder: '(555) 123-4567',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    noContacts: 'Sem contatos de emergência',
    noContactsDesc: 'Adicione pessoas de confiança que devem saber se você encontrar o ICE',
    customMessage: 'Mensagem Personalizada (opcional)',
    customMessagePlaceholder: 'Deixe em branco para usar a mensagem padrão',
    defaultMessagePreview: 'Prévia da mensagem:',
    privacyNote: 'Os contatos são armazenados apenas no seu dispositivo - nunca enviados aos nossos servidores',
    invalidPhone: 'Por favor, insira um número de telefone válido',
    maxContacts: 'Máximo de 5 contatos',
  },
}

const MAX_CONTACTS = 5

export function EmergencyContactsManager() {
  const { language } = useLanguage()
  const t = translations[language]
  const {
    contacts,
    customMessage,
    addContact,
    removeContact,
    updateContact,
    setCustomMessage,
  } = useEmergencyContacts()

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    setError('')
    if (!newName.trim()) {
      setError(t.name)
      return
    }
    if (!isValidPhone(newPhone)) {
      setError(t.invalidPhone)
      return
    }

    const success = addContact(newName, newPhone)
    if (success) {
      setNewName('')
      setNewPhone('')
      setIsAdding(false)
    }
  }

  const handleUpdate = (id: string) => {
    setError('')
    if (!newName.trim()) {
      setError(t.name)
      return
    }
    if (!isValidPhone(newPhone)) {
      setError(t.invalidPhone)
      return
    }

    const success = updateContact(id, newName, newPhone)
    if (success) {
      setEditingId(null)
      setNewName('')
      setNewPhone('')
    }
  }

  const startEdit = (id: string) => {
    const contact = contacts.find(c => c.id === id)
    if (contact) {
      setNewName(contact.name)
      setNewPhone(contact.phone)
      setEditingId(id)
      setIsAdding(false)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    setNewName('')
    setNewPhone('')
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Phone className="h-5 w-5 text-[#DC2626] flex-shrink-0" />
          <span className="break-words">{t.title}</span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1 break-words">{t.subtitle}</p>
      </div>

      {/* Contact List */}
      <div className="space-y-2">
        {contacts.length === 0 && !isAdding ? (
          <div className="text-center py-8 px-4 rounded-[12px] bg-muted/30 border border-dashed border-border">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium break-words">{t.noContacts}</p>
            <p className="text-xs text-muted-foreground mt-1 break-words">{t.noContactsDesc}</p>
          </div>
        ) : (
          contacts.map(contact => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-3 rounded-[8px] bg-muted/30 border border-border/50"
            >
              {editingId === contact.id ? (
                // Edit mode
                <div className="flex-1 space-y-2">
                  <Input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="h-9"
                  />
                  <Input
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    type="tel"
                    className="h-9"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(contact.id)}
                      className="flex-1 h-8"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {t.save}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                      className="h-8"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                // Display mode
                <>
                  <div className="w-10 h-10 rounded-full bg-[#00A6B4]/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-[#00A6B4]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{contact.name}</p>
                    <p className="text-small text-muted-foreground">
                      {formatPhoneNumber(contact.phone)}
                    </p>
                  </div>
                  <button
                    onClick={() => startEdit(contact.id)}
                    className="p-2 hover:bg-muted rounded-[6px] text-muted-foreground hover:text-foreground"
                    aria-label={t.edit}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="p-2 hover:bg-[#DC2626]/10 rounded-[6px] text-muted-foreground hover:text-[#DC2626]"
                    aria-label={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}

        {/* Add new contact form */}
        {isAdding && (
          <div className="p-4 rounded-[12px] bg-[#00A6B4]/5 border border-[#00A6B4]/20 space-y-3">
            <div className="space-y-2">
              <label className="text-small font-medium flex items-center gap-1">
                <User className="h-3 w-3" />
                {t.name}
              </label>
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder={t.namePlaceholder}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-small font-medium flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {t.phone}
              </label>
              <Input
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                type="tel"
                className="h-10"
              />
            </div>
            {error && (
              <p className="text-small text-[#DC2626]">{error}</p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1 h-10 bg-[#00A6B4] hover:bg-[#00A6B4]/90">
                <Check className="h-4 w-4 mr-1" />
                {t.save}
              </Button>
              <Button variant="outline" onClick={cancelEdit} className="h-10">
                {t.cancel}
              </Button>
            </div>
          </div>
        )}

        {/* Add button */}
        {!isAdding && !editingId && contacts.length < MAX_CONTACTS && (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full h-11 rounded-[8px] border-dashed"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {t.addContact}
          </Button>
        )}

        {contacts.length >= MAX_CONTACTS && !isAdding && (
          <p className="text-small text-muted-foreground text-center">{t.maxContacts}</p>
        )}
      </div>

      {/* Custom Message */}
      {contacts.length > 0 && (
        <div className="space-y-2">
          <label className="text-small font-medium flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {t.customMessage}
          </label>
          <textarea
            value={customMessage}
            onChange={e => setCustomMessage(e.target.value)}
            placeholder={t.customMessagePlaceholder}
            className="w-full h-24 px-3 py-2 text-sm rounded-[8px] border bg-background resize-none"
            maxLength={500}
          />
          <div className="p-3 rounded-[8px] bg-muted/50 border border-border/50">
            <p className="text-[11px] text-muted-foreground mb-1">{t.defaultMessagePreview}</p>
            <p className="text-small italic">
              {customMessage || defaultMessages[language]}
            </p>
          </div>
        </div>
      )}

      {/* Privacy Note */}
      <div className="flex items-start gap-2 p-3 rounded-[8px] bg-[#84CC16]/10 border border-[#84CC16]/20">
        <Shield className="h-4 w-4 text-[#84CC16] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#84CC16] break-words">{t.privacyNote}</p>
      </div>
    </div>
  )
}
