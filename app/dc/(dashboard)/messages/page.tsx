"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { markSubmissionRead, deleteSubmission } from "@/lib/data/actions";
import { Button, Input, Card } from "@/components/ui";
import { Loader2, Search, Mail, MailOpen, Trash2, Reply, ArrowLeft, Calendar, User } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelect = async (msg: Submission) => {
    setSelectedId(msg.id);
    if (!msg.is_read) {
      // Mark as read in DB and update locally
      try {
        await markSubmissionRead(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setMutatingId(id);
    try {
      await deleteSubmission(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      alert("Failed to delete message");
    } finally {
      setMutatingId(null);
    }
  };

  const selectedMsg = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-h1 font-bold tracking-tight flex items-center space-x-3">
            <span>Inquiries</span>
            {unreadCount > 0 && (
              <span className="text-caption font-bold bg-foreground text-background px-2.5 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-small text-muted">
            Read and reply to user inquiries sent through the contact form.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
          <p className="text-caption text-muted mt-2">Loading inbox messages...</p>
        </div>
      ) : (
        <div className="flex-1 flex border border-border rounded-sm overflow-hidden bg-background">
          {/* Master List Column */}
          <div
            className={`w-full md:w-[380px] lg:w-[420px] flex flex-col border-r border-border shrink-0 ${
              selectedId ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search and Filters */}
            <div className="p-4 border-b border-border space-y-3 bg-surface/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  placeholder="Search inbox..."
                  className="pl-9 h-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex border border-border rounded-sm overflow-hidden">
                {(["all", "unread", "read"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      filter === f
                        ? "bg-foreground text-background"
                        : "bg-background text-muted hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-muted">
                  <Mail className="h-6 w-6 mx-auto mb-2 text-muted/50" />
                  <p className="text-caption font-medium">No messages found</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isActive = selectedId === msg.id;
                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelect(msg)}
                      className={`w-full text-left p-4 hover:bg-surface/50 transition-colors flex flex-col gap-1.5 ${
                        isActive ? "bg-surface" : ""
                      } ${!msg.is_read ? "border-l-2 border-foreground bg-surface/10" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-small truncate flex-1 ${!msg.is_read ? "font-bold text-foreground" : "text-muted"}`}>
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-muted shrink-0">
                          {new Date(msg.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate ${!msg.is_read ? "font-semibold text-foreground" : "text-muted"}`}>
                        {msg.subject || "(No Subject)"}
                      </div>
                      <p className="text-caption text-muted truncate w-full">
                        {msg.message}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Details Column */}
          <div
            className={`flex-1 flex flex-col min-w-0 ${
              selectedId ? "flex" : "hidden md:flex justify-center items-center bg-surface/10"
            }`}
          >
            {selectedMsg ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Detail Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface/30 shrink-0">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="md:hidden p-1.5 border border-border rounded-sm hover:bg-surface transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center space-x-2 ml-auto">
                    <a
                      href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(
                        selectedMsg.subject || ""
                      )}`}
                      className="inline-flex items-center justify-center rounded-sm bg-foreground text-background text-[11px] font-semibold uppercase tracking-wider px-4 py-2 hover:opacity-90 transition-opacity"
                    >
                      <Reply className="h-3.5 w-3.5 mr-1.5" />
                      Reply
                    </a>

                    <Button
                      onClick={() => handleDelete(selectedMsg.id)}
                      disabled={mutatingId === selectedMsg.id}
                      variant="secondary"
                      size="sm"
                      className="h-9 p-2.5"
                    >
                      {mutatingId === selectedMsg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Detail Meta */}
                <div className="p-6 border-b border-border space-y-4 shrink-0">
                  <div>
                    <h2 className="text-h2 font-bold tracking-tight">
                      {selectedMsg.subject || "(No Subject)"}
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-small">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 bg-surface border border-border rounded-full flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-muted" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{selectedMsg.name}</p>
                        <p className="text-caption text-muted">{selectedMsg.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-caption text-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(selectedMsg.created_at).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detail Body */}
                <div className="flex-1 p-6 overflow-y-auto bg-background text-body whitespace-pre-wrap leading-relaxed select-text">
                  {selectedMsg.message}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-muted">
                <MailOpen className="h-8 w-8 mx-auto mb-3 text-muted/30" />
                <p className="text-body font-medium">No Message Selected</p>
                <p className="text-caption">Select an inquiry from the inbox list to read it.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
