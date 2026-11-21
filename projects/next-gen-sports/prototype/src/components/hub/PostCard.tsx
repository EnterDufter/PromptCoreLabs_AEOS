import React, { useState } from 'react';
import { Award, CheckCircle2, MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { FeedPost } from '../../types/ngs';
import { useNgs } from '../../context/NgsContext';

export const PostCard: React.FC<{ post: FeedPost }> = ({ post }) => {
  const { toggleEndorsePost, addComment, openCopyAiModal, setActiveModule } = useNgs();
  const [showComments, setShowComments] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  const initials = post.authorName
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentDraft.trim()) return;
    addComment(post.id, commentDraft);
    setCommentDraft('');
  };

  return (
    <article className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm transition hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#031B33] font-display text-xs font-bold text-white">
            {initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-bold text-[#031B33]">{post.authorName}</span>
              {post.isOfficial ? (
                <span className="rounded-full bg-[#0D47A1]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0D47A1]">
                  Oficial
                </span>
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#0D47A1]" />
              )}
              <span className="text-xs text-slate-500">• {post.authorRoleLabel}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {post.createdAt}
              {post.location ? ` • ${post.location}` : ''}
            </div>
          </div>
        </div>

        {post.readinessDelta && (
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#0E9F6E]">
            {post.readinessDelta}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#263238]">{post.body}</p>

      {/* Telemetry / Proof Highlight */}
      {post.telemetryHighlight && (
        <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-[#D9E3EA] bg-[#031B33] p-3.5 text-white sm:grid-cols-3">
          <div>
            <div className="text-[11px] text-slate-300">{post.telemetryHighlight.metricLabel}</div>
            <div className="font-display text-xl font-bold text-[#17B3B3]">
              {post.telemetryHighlight.metricValue}
            </div>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-100">
            {post.telemetryHighlight.consistencyLabel}
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            <span className="rounded-full bg-[#17B3B3]/20 px-2.5 py-1 text-[11px] font-semibold text-[#17B3B3]">
              {post.telemetryHighlight.statusLabel}
            </span>
          </div>
        </div>
      )}

      {/* Evidence Tag / CTA */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D9E3EA] bg-[#FAFAFB] px-3 py-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#031B33]">
          <Award className="h-3.5 w-3.5 text-[#17B3B3]" />
          <span>{post.evidenceTag}</span>
        </div>

        {post.ctaLabel && post.ctaTargetModule && (
          <button
            type="button"
            onClick={() => setActiveModule(post.ctaTargetModule!)}
            className="rounded-lg bg-[#0D47A1] px-3 py-1 text-xs font-semibold text-white hover:bg-[#031B33]"
          >
            {post.ctaLabel}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#D9E3EA] pt-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => toggleEndorsePost(post.id)}
            className={`inline-flex items-center gap-1.5 font-medium transition ${
              post.likedByMe ? 'text-[#0D47A1]' : 'hover:text-[#031B33]'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.reactionsCount} Endossos</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className="inline-flex items-center gap-1.5 font-medium hover:text-[#031B33]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments.length} Comentários</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => openCopyAiModal(post)}
          className="inline-flex items-center gap-1.5 font-medium text-[#0D47A1] hover:underline"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Agendar nas redes externas</span>
        </button>
      </div>

      {/* Highlighted or expanded comments */}
      {(post.comments.length > 0 || showComments) && (
        <div className="mt-3 space-y-2 border-t border-[#D9E3EA] pt-2.5">
          {post.comments.map((c) => (
            <div key={c.id} className="rounded-xl bg-[#FAFAFB] px-3 py-2 text-xs">
              <span className="font-semibold text-[#031B33]">{c.authorName}</span>{' '}
              <span className="text-[11px] text-slate-500">({c.authorRole})</span>:{' '}
              <span className="text-[#263238]">{c.text}</span>
            </div>
          ))}

          {showComments && (
            <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Adicionar endosso ou comentário técnico..."
                className="flex-1 rounded-lg border border-[#D9E3EA] px-3 py-1.5 text-xs focus:border-[#0D47A1] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#031B33] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0D47A1]"
              >
                Enviar
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
};
