import { toast as sonnerToast } from 'sonner';
import type { ExternalToast } from 'sonner';

function toId(message: unknown): string {
  return String(message);
}

function error(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.error(message, { id: toId(message), ...data });
}

function success(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.success(message, { id: toId(message), ...data });
}

function warning(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.warning(message, { id: toId(message), ...data });
}

function info(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.info(message, { id: toId(message), ...data });
}

function base(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast(message, { id: toId(message), ...data });
}

export const toast = Object.assign(base, { error, success, warning, info });
