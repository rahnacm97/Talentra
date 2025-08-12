export interface GoogleAccounts {
  id: {
    initialize: (config: {
      client_id: string;
      callback: (response: { credential: string }) => void;
    }) => void;
    renderButton: (element: HTMLElement | null, options: {
      theme: string;
      size: string;
      text: string;
      width: number;
    }) => void;
    prompt: () => void;
  };
}

declare global {
  interface Window {
    google: GoogleAccounts;
  }
}