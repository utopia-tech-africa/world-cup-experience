"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Mail,
  Phone,
  Package,
  User,
  Clock,
  CheckCircle,
  Archive,
  AlertCircle,
} from "lucide-react";
import { useContacts } from "@/hooks/queries/useContacts";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  read: {
    label: "Read",
    icon: CheckCircle,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    color: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20",
  },
};

export default function AdminInquiriesPage() {
  const { contacts, isLoading, updateStatus, updatingId } = useContacts();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-clash font-bold tracking-tight">
            Inquiries
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage visitor questions and package interests.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground border-l border-border pl-6">
          <div className="flex flex-col">
            <span className="text-foreground font-semibold">
              {contacts.length}
            </span>
            <span>Total Messages</span>
          </div>
          <div className="flex flex-col">
            <span className="text-amber-600 font-semibold">
              {contacts.filter((c) => c.status === "pending").length}
            </span>
            <span>Unread</span>
          </div>
          {/* Archived */}
          <div className="flex flex-col">
            <span className="text-neutral-600 font-semibold">
              {contacts.filter((c) => c.status === "archived").length}
            </span>
            <span>Archived</span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl opacity-40">
            <Mail className="size-12 mb-4" />
            <p className="font-medium text-lg">Your inbox is clear</p>
            <p className="text-sm">No visitor inquiries found.</p>
          </div>
        ) : (
          contacts.map((msg) => (
            <Card
              key={msg.id}
              className="group border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Sidebar/Status Info */}
                  <div
                    className={cn(
                      "md:w-1.5 shrink-0",
                      msg.status === "pending"
                        ? "bg-amber-500"
                        : msg.status === "read"
                          ? "bg-blue-500"
                          : "bg-neutral-500",
                    )}
                  />

                  <div className="flex-1 p-5 md:p-6 space-y-4">
                    {/* Top Row: User Info & Status Selector */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                            <User className="size-5 text-primary/60" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">
                              {msg.name}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider font-medium">
                              <Clock className="size-3" />{" "}
                              {formatDate(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Select
                          value={msg.status}
                          onValueChange={(val) => {
                            if (val) {
                              updateStatus({ id: msg.id, status: val });
                            }
                          }}
                          disabled={updatingId === msg.id}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-36 h-9 transition-colors",
                              STATUS_CONFIG[
                                msg.status as keyof typeof STATUS_CONFIG
                              ].color,
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {updatingId === msg.id && (
                                <Loader2 className="size-3.5 animate-spin" />
                              )}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_CONFIG).map(
                              ([val, { label, icon: Icon }]) => (
                                <SelectItem key={val} value={val}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="size-4" />
                                    <span>{label}</span>
                                  </div>
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Metadata Section (Email, Phone, Package) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-6 py-3 border-y border-border/50 text-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Mail className="size-3.5 text-muted-foreground" />
                        </div>
                        <span
                          className="truncate"
                          title={msg.email || "Not provided"}
                        >
                          {msg.email || (
                            <span className="opacity-40 italic">
                              Not provided
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Phone className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="truncate">
                          {msg.phone || (
                            <span className="opacity-40 italic">
                              Phone not provided
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Package className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="truncate font-medium text-primary/80">
                          {msg.packageName || (
                            <span className="opacity-40 font-normal italic">
                              No package selected
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative pt-2">
                      <div className="absolute top-2 left-0 text-muted-foreground opacity-20">
                        <AlertCircle className="size-4" />
                      </div>
                      <div className="pl-7">
                        <p
                          className={cn(
                            "text-base leading-relaxed whitespace-pre-wrap",
                            !msg.message && "italic opacity-50",
                          )}
                        >
                          {msg.message || "No message provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
