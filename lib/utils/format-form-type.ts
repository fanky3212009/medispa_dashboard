import { ConsentFormType } from "@/types/consent-form"

export function formatFormType(type: ConsentFormType): string {
  return type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')
}

export function getFormDescription(type: ConsentFormType): string {
  switch (type) {
    case 'GENERAL_TREATMENT':
      return "General treatment consent form including pre/post treatment requirements."
    case 'BOTOX':
      return "Botox treatment consent form including risks, benefits, and aftercare instructions."
    case 'FILLER':
      return "Dermal filler consent form including procedure details and risks."
    default:
      return "Treatment consent form"
  }
}
