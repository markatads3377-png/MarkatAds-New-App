import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Send, Sparkles, MessageSquare, ShieldCheck } from "lucide-react";
import {
  type FeedPost,
  type FeedComment,
  getLocalComments,
  addCommentToPost,
} from "@/lib/feedService";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";

interface CommentsModalProps {
  post: FeedPost | null;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  isOpen,
  onClose,
  onCommentAdded,
}) => {
  const { user, username, displayName } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (post && isOpen) {
      setComments(getLocalComments(post.id));
    }
  }, [post, isOpen]);

  if (!post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const authorId = user?.uid || "user_guest";
      const authorName = displayName || username || "OOH Enthusiast";
      const authorUsername = username || "spotter";

      const created = await addCommentToPost(post.id, commentText, {
        id: authorId,
        name: authorName,
        username: authorUsername,
        badge: "⭐ Active Spotter",
      });

      setComments((prev) => [...prev, created]);
      setCommentText("");
      onCommentAdded?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border">
        {/* Header with Post Summary */}
        <DialogHeader className="p-4 sm:p-5 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border border-primary/20">
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
              <AvatarFallback>{post.authorName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-bold truncate">
                Comments & Sighting Analysis
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground truncate">
                {post.title} • {post.city}, {post.country}
              </DialogDescription>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Earn +10 Coins/Comment</span>
            </div>
          </div>
        </DialogHeader>

        {/* Comments Feed List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto">
                <MessageSquare className="size-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">No analysis comments yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Be the first to share medium insights, footfall notes, or placement quality reviews.
                You will earn +10 OOH Coins!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/60 hover:border-border transition-colors"
              >
                <Link
                  to="/profile"
                  search={{ id: comment.authorId, u: comment.authorUsername }}
                  onClick={onClose}
                  className="shrink-0"
                >
                  <Avatar className="size-9 border border-border">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback>{comment.authorName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to="/profile"
                      search={{ id: comment.authorId, u: comment.authorUsername }}
                      onClick={onClose}
                      className="text-xs font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {comment.authorName}
                    </Link>
                    <span className="text-[11px] text-muted-foreground">
                      @{comment.authorUsername}
                    </span>
                    {comment.authorBadge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border/50">
                        {comment.authorBadge}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => {
                        // Optimistic comment like
                        setComments((prev) =>
                          prev.map((c) =>
                            c.id === comment.id ? { ...c, likesCount: c.likesCount + 1 } : c,
                          ),
                        );
                      }}
                      className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                    >
                      <Heart className="size-3.5" />
                      <span>{comment.likesCount} helpful</span>
                    </button>
                    <span>•</span>
                    <span className="text-emerald-500 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="size-3" /> Verified Spotter
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Footer */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-border/80 bg-muted/20 space-y-3"
        >
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share insights on this placement (e.g. traffic visibility, contrast, peak dwell times, brand recall)..."
            rows={2}
            className="text-xs resize-none bg-background border-border/80 focus-visible:ring-primary"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" />
              Posting verified insights rewards +10 OOH Coins
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !commentText.trim()}
              className="h-8 text-xs font-semibold gap-1.5 px-4"
            >
              <Send className="size-3" />
              {submitting ? "Posting..." : "Post Insight"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
