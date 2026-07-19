import { useState } from 'react';

export interface EmailFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface HandleSubmitParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  setIsSubmitting: (value: boolean) => void;
  setSubmitStatus: (value: 'idle' | 'success' | 'error') => void;
  setIsModalOpen: (value: boolean) => void;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setSubject: (value: string) => void;
  setMessage: (value: string) => void;
}

export const handleSubmit = async (e: React.FormEvent, params: HandleSubmitParams) => {
  e.preventDefault();

  const { name, email, subject, message, setIsSubmitting, setSubmitStatus, setIsModalOpen, setName, setEmail, setSubject, setMessage } = params;

  if (!name || !email || !subject || !message) {
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus('idle');

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    setIsSubmitting(false);
    setSubmitStatus('success');
    setIsModalOpen(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  } catch (error) {
    console.error('Error submitting form:', error);
    setIsSubmitting(false);
    setSubmitStatus('error');
    setIsModalOpen(true);
  }
};

export function useEmailLogic() {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendEmail = async (data: EmailFormData) => {
    const { name, email, subject, message } = data;

    if (!name || !email || !subject || !message) {
      setErrorMessage('All fields are required');
      setSendStatus('error');
      return false;
    }

    setIsSending(true);
    setSendStatus('idle');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send email');
      }

      setSendStatus('success');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send email');
      setSendStatus('error');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const resetStatus = () => {
    setSendStatus('idle');
    setErrorMessage(null);
  };

  return {
    isSending,
    sendStatus,
    errorMessage,
    sendEmail,
    resetStatus,
  };
}
