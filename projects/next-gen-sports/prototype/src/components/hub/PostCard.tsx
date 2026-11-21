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

  const endossosLabel =
    post.reactionsCount === 1 ? '1 Endosso' : `${post.reactionsCount} Endossos`;
  const comentariosLabel =
    post.comments.length === 1 ? '1 Comentário' : `${post.comments.length} Comentários`;

  return (
    <article className="rounded-2xl border border-[#D9E3EA] bg-white p-4 shadow-sm transition hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt={post.authorName}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#031B33] font-display text-xs font-bold text-white">
              {initials}
            </div>
          )}
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

      {/* Hybrid Telemetry Card: Real Photo Left + Dark Telemetry Mini-Panel Right */}
      {post.telemetryHighlight && post.imageUrl && (
        <div className="mt-3 grid grid-cols-1 overflow-hidden rounded-xl border border-[#D9E3EA] bg-[#031B33] sm:grid-cols-12">
          <div className="h-44 sm:col-span-6 sm:h-auto">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-between p-4 text-white sm:col-span-6">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] font-medium text-slate-300">
                  {post.telemetryHighlight.metricLabel}
                </div>
                <div className="font-display text-2xl font-bold text-[#0E9F6E]">
                  {post.telemetryHighlight.metricValue}
                </div>
              </div>
              <span className="rounded-full bg-[#17B3B3]/20 px-2 py-0.5 text-[10px] font-semibold text-[#17B3B3]">
                {post.telemetryHighlight.statusLabel}
              </span>
            </div>

            {/* Clean SVG Telemetry Curve */}
            <div className="my-2">
              <svg viewBox="0 0 200 44" className="h-10 w-full">
                <path
                  d="M0 32 Q 25 10, 50 26 T 100 18 T 150 28 T 200 12"
                  fill="none"
                  stroke="#17B3B3"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 34 Q 25 18, 50 29 T 100 22 T 150 31 T 200 19"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>{post.telemetryHighlight.consistencyLabel}</span>
              <span className="font-semibold text-[#17B3B3]">Validado</span>
            </div>
          </div>
        </div>
      )}

      {/* Official League Banner Card */}
      {post.bannerUrl && (
        <div className="mt-3 overflow-hidden rounded-xl border border-[#D9E3EA] bg-[#FAFAFB]">
          <img
            src={post.bannerUrl}
            alt={post.title}
            className="h-44 w-full object-cover"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 p-3">
            <div>
              <div className="font-display text-xs font-bold text-[#031B33]">{post.title}</div>
              <div className="text-[11px] text-slate-500">{post.evidenceTag}</div>
            </div>
            {post.ctaLabel && post.ctaTargetModule && (
              <button
                type="button"
                onClick={() => setActiveModule(post.ctaTargetModule!)}
                className="rounded-lg bg-[#0D47A1] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#031B33]"
              >
                {post.ctaLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Evidence Tag / CTA for non-banner posts */}
      {!post.bannerUrl && (
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
      )}

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
            <span>{endossosLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className="inline-flex items-center gap-1.5 font-medium hover:text-[#031B33]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comentariosLabel}</span>
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

      {/* Comments */}
      {(post.comments.length > 0 || showComments) && (
        <div className="mt-3 space-y-2 border-t border-[#D9E3EA] pt-2.5">
          {post.comments.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-2.5 rounded-xl bg-[#FAFAFB] px-3 py-2 text-xs"
            >
              {c.authorAvatarUrl && (
                <img
                  src={c.authorAvatarUrl}
                  alt={c.authorName}
                  className="h-6 w-6 shrink-0 rounded-full object-cover"
                />
              )}
              <div>
                <span className="font-semibold text-[#031B33]">{c.authorName}</span>{' '}
                <span className="text-[11px] text-slate-500">({c.authorRole})</span>:{' '}
                <span className="text-[#263238]">{c.text}</span>
              </div>
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
