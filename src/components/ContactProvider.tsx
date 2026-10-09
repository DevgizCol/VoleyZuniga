"use client";

import { createContext, useContext } from "react";
import { DEFAULT_CONTACT, telLink, waLink, type Contact } from "@/config/contact";

const ContactContext = createContext<Contact>(DEFAULT_CONTACT);

export function ContactProvider({ value, children }: { value: Contact; children: React.ReactNode }) {
  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
}

/** Teléfono, WhatsApp e Instagram vigentes (los de la hoja, o los de respaldo). */
export function useContact() {
  const contact = useContext(ContactContext);
  return { contact, wa: (message?: string) => waLink(contact, message), tel: telLink(contact) };
}
