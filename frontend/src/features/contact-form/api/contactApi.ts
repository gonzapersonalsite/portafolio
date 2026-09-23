import emailjs from '@emailjs/browser';
import type { ContactMessage } from '../model/types';

const SEND_TIMEOUT_MS = 15000;
const SERVICE_ID_PREFIX = 'service_';

export class ContactNotConfiguredError extends Error {
  constructor() {
    super('EmailJS is not configured');
    this.name = 'ContactNotConfiguredError';
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
    const timer = setTimeout(
      () => reject(new Error(`EmailJS request timed out after ${timeoutMs}ms`)),
      timeoutMs,
    );

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

  await withTimeout(
    emailjs.send(
      serviceId,
      templateId,
      {
        name: message.name,
        email: message.email,
        message: message.message,
        title: 'Portfolio Contact Message',
        time: new Date().toLocaleString(),
      },
      publicKey,
    ),
    SEND_TIMEOUT_MS,
  );
}
