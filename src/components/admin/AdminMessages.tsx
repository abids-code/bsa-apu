import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
};

const topicStyles: Record<string, string> = {
  join: "bg-primary/10 text-primary",
  arrival: "bg-secondary/15 text-secondary",
  event: "bg-amber-100 text-amber-800",
  other: "bg-muted text-muted-foreground",
};

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchMessages() {
      if (!supabase) {
        setErrorMessage("Supabase is not configured.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, name, email, topic, message, created_at")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        setErrorMessage(error.message);
      } else {
        setMessages(data);
      }
      setLoading(false);
    }

    void fetchMessages();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading messages...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Could not load messages: {errorMessage}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.length ? (
          messages.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="whitespace-nowrap font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>
                <Badge className={topicStyles[item.topic] ?? topicStyles["other"]}>
                  {item.topic}
                </Badge>
              </TableCell>
              <TableCell className="min-w-56 max-w-lg whitespace-normal break-words">
                {item.message}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
              No messages found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
