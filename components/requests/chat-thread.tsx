"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendMessage } from "@/app/actions/messages";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage } from "@/types/domain";

export function ChatThread({
  requestId,
  initialMessages,
  currentUserId,
  otherName,
}: {
  requestId: string;
  initialMessages: ChatMessage[];
  currentUserId: string;
  otherName: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const action = sendMessage.bind(null, requestId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((current) =>
            current.some((m) => m.id === newMessage.id)
              ? current
              : [...current, newMessage]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.errors && !state?.message) {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="max-h-96 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">
            Todavía no hay mensajes. Escribe el primero.
          </p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <span className="text-xs text-muted">
                  {isMine ? "Tú" : otherName}
                </span>
                <p
                  className={`mt-0.5 max-w-xs rounded-2xl px-3.5 py-2 text-sm ${
                    isMine
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-card"
                  }`}
                >
                  {message.body}
                </p>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <Textarea
          name="body"
          placeholder="Escribe un mensaje…"
          rows={2}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Enviando…" : "Enviar"}
        </Button>
      </form>
      {state?.message && (
        <p className="px-3 pb-2 text-xs text-red-600">{state.message}</p>
      )}
    </div>
  );
}
