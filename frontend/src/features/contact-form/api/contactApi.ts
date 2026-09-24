import type { ContactMessage } from '../model/types';

const SEND_TIMEOUT_MS = 15000;
const SERVICE_ID_PREFIX = 'service_';
// EmailJS rejects a second send from this browser within this window (429), so a double click
// or a bot cannot drain the monthly quota that keeps the form working.
const RATE_LIMIT = { id: 'portfolio-contact', throttle: 10000 };

export class ContactNotConfiguredError extends Error {
  constructor() {
    super('EmailJS is not configured');
    this.name = 'ContactNotConfiguredError';
  }
}

// The request was not cancelled, only abandoned: the message may still have been delivered.
export class ContactTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`EmailJS request timed out after ${timeoutMs}ms`);
    this.name = 'ContactTimeoutError';
  }
}

interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

function getConfig(): EmailJsConfig {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !serviceId.startsWith(SERVICE_ID_PREFIX) || !templateId || !publicKey) {
    throw new ContactNotConfiguredError();
  }

  return { serviceId, templateId, publicKey };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new ContactTimeoutError(timeoutMs)), timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  const { serviceId, templateId, publicKey } = getConfig();
  // Loaded on submit: the SDK touches localStorage while it loads, which throws when the visitor
  // blocks site data. Loading it here turns that into a send error the form reports, instead of
  // a Contact page that fails to load.
  const { default: emailjs } = await import('@emailjs/browser');

  await withTimeout(
    emailjs.send(
      serviceId,
      templateId,
      {
        name: message.name,
        email: message.email,
        message: message.message,
        title: 'Portfolio Contact Message',
        // ISO 8601 with its zone, so the inbox shows an unambiguous time whatever the visitor's locale.
        time: new Date().toISOString(),
      },
      { publicKey, blockHeadless: true, limitRate: RATE_LIMIT },
    ),
    SEND_TIMEOUT_MS,
  );
}
