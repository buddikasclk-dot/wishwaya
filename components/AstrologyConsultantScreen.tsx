import React, { useEffect, useMemo, useState } from 'react';
import { ConsultantChatMessage, ConsultantCredits, UserProfile } from '../types';
import { fetchConsultantCredits, sendConsultantMessage } from '../src/services/astrologyConsultantClient';
import StripeCheckoutButton from './StripeCheckoutButton';

interface AstrologyConsultantScreenProps {
  profile: UserProfile;
  userId: string;
  userEmail?: string | null;
}

const QUICK_SUGGESTIONS = ['සෞඛ්‍යය පිළිබඳව', 'රැකියාව සහ ධනය', 'අධ්‍යාපනය'];

const INITIAL_CREDITS: ConsultantCredits = {
  user_id: '',
  free_messages_used: 0,
  paid_credits: 0,
  total_credits: 0,
  is_premium: false,
  free_remaining: 4,
  can_chat: true,
};

const renderInlineFormatting = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const isBold = part.startsWith('**') && part.endsWith('**');
    if (isBold) {
      return (
        <strong key={index} className="font-black text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const normalizeAssistantText = (text: string) =>
  String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const isBulletLine = (line: string) => /^[-*•]\s+/.test(line);
const isNumberedLine = (line: string) => /^\d+\.\s+/.test(line);
const isPanelLine = (line: string) => /^(Tip|Note|Remedy|Warning|Summary|Focus)\s*:/i.test(line);
const isHeadingLine = (line: string) =>
  /^\*\*[^*]+\*\*$/.test(line) || (/^[^.:]{3,60}:$/.test(line) && !isNumberedLine(line));

const renderStructuredMessage = (text: string) => {
  const lines = normalizeAssistantText(text).split('\n');
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (isBulletLine(line)) {
      const items: string[] = [];
      while (index < lines.length && isBulletLine(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*•]\s+/, ''));
        index += 1;
      }
      blocks.push(
        <ul key={`ul-${index}`} className="list-disc space-y-2 pl-5 marker:text-emerald-500">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-1 text-sm leading-7 text-slate-700">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (isNumberedLine(line)) {
      const items: string[] = [];
      while (index < lines.length && isNumberedLine(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }
      blocks.push(
        <ol key={`ol-${index}`} className="list-decimal space-y-2 pl-5 marker:font-black marker:text-indigo-600">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-1 text-sm leading-7 text-slate-700">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (isPanelLine(line)) {
      const [label, ...rest] = line.split(':');
      blocks.push(
        <div
          key={`panel-${index}`}
          className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm leading-7 text-emerald-900"
        >
          <span className="mr-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
            {label}
          </span>
          <span>{renderInlineFormatting(rest.join(':').trim())}</span>
        </div>
      );
      index += 1;
      continue;
    }

    if (isHeadingLine(line)) {
      const headingText = line.replace(/^\*\*|\*\*$/g, '').replace(/:$/, '');
      blocks.push(
        <h4 key={`heading-${index}`} className="pt-1 text-[13px] font-black uppercase tracking-[0.16em] text-slate-800">
          {headingText}
        </h4>
      );
      index += 1;
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isBulletLine(lines[index].trim()) &&
      !isNumberedLine(lines[index].trim()) &&
      !isPanelLine(lines[index].trim()) &&
      !isHeadingLine(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`} className="text-sm leading-7 text-slate-700">
        {renderInlineFormatting(paragraphLines.join(' '))}
      </p>
    );
  }

  return <div className="space-y-3">{blocks}</div>;
};

const ThinkingBubble = () => (
  <div className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.2s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.1s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-emerald-600" />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">Consultant is preparing</p>
        <p className="text-sm text-slate-600">Your answer is being generated...</p>
      </div>
    </div>
  </div>
);

const AstrologyConsultantScreen: React.FC<AstrologyConsultantScreenProps> = ({
  profile,
  userId,
  userEmail = null,
}) => {
  const [credits, setCredits] = useState<ConsultantCredits>(INITIAL_CREDITS);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [messages, setMessages] = useState<ConsultantChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canChat = useMemo(
    () => (credits.paid_credits > 0 || credits.free_messages_used < 4) && !!userId,
    [credits, userId]
  );

  const loadCredits = async () => {
    if (!userId) return;
    setLoadingCredits(true);
    try {
      const next = await fetchConsultantCredits(userId, userEmail);
      setCredits(next);
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to load consultant credits');
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    void loadCredits();
  }, [userId, userEmail]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const topup = url.searchParams.get('topup');
    if (topup === 'success') {
      void loadCredits();
      url.searchParams.delete('topup');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || sending || !userId || !canChat) return;
    const text = input.trim();
    setInput('');
    setError(null);
    setSending(true);

    const userMessage: ConsultantChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);

    try {
      const result = await sendConsultantMessage({
        userId,
        userEmail,
        message: text,
        userProfile: profile,
      });

      if (result.status === 'limit_reached' || result.status === 'temporary_unavailable') {
        setError(result.message);
        if (result.credits) setCredits(result.credits);
        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          text: result.message,
          createdAt: new Date().toISOString(),
        },
      ]);
      setCredits(result.credits);
    } catch (nextError: any) {
      setError(nextError?.message || 'Unable to get the consultant reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const appendQuickSuggestion = (suggestion: string) => {
    setInput((current) => (current ? `${current}\n${suggestion}` : suggestion));
  };

  return (
    <div className="relative space-y-5 p-6 pb-28 animate-in fade-in duration-500">
      <header className="relative overflow-hidden rounded-[2.6rem] border border-white/80 bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.18),_transparent_38%),linear-gradient(140deg,_#f7fff9_0%,_#eef7ff_52%,_#f8faff_100%)] p-5 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)]">
        <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute -left-12 bottom-0 h-24 w-24 rounded-full bg-indigo-100/45 blur-2xl" />
        <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
          Premium Consultant
        </p>
        <h2 className="relative z-10 mt-2 text-2xl font-black text-slate-900">
          Personal Astrology Consultant
        </h2>
        <p className="relative z-10 mt-2 sinhala text-sm leading-6 text-slate-600">
          ඔබගේ ඕනෑම ගැටලුවක් මෙහි සඳහන් කරන්න. ජ්‍යොතිෂයට අනුව ඔබට අවශ්‍ය හොඳම විස්ඳුම් හෝ උපදෙස් අප ලබාදෙන්නෙමු.
        </p>
        <div className="relative z-10 mt-4 flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="rounded-full bg-white px-3 py-1 text-slate-600">
            Paid Credits: {credits.paid_credits}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-slate-600">
            Free Left: {Math.max(0, 4 - credits.free_messages_used)}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-slate-600">Profile Linked</span>
        </div>
      </header>

      <section className="rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Using Profile Data
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">Name: {profile.name || '-'}</div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">DOB: {profile.dob || '-'}</div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">Time: {profile.birthTime || '-'}</div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">Place: {profile.city || '-'}</div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">Lagna: {profile.lagna || '-'}</div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600">Rashi: {profile.rashi || '-'}</div>
          <div className="col-span-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-600">
            Nekath: {profile.nekatha || '-'} {profile.nekathPadaya ? `• ${profile.nekathPadaya}` : ''}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/?tab=profile';
          }}
          className="mt-3 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700"
        >
          Edit In Profile
        </button>
      </section>

      <div className="min-h-[38vh] space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
            අපි ඔබට පියවරෙන් පියවර උපදෙස් ලබා දෙන්නෙමු. මුලින් ඉතා කෙටියෙන් ගැටලුව සඳහන් කරන්න.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-[1.5rem] px-4 py-3 text-sm leading-7 shadow-sm ${
                message.role === 'assistant'
                  ? 'border border-slate-200 bg-white text-slate-700'
                  : 'ml-8 bg-slate-900 text-white'
              }`}
            >
              {message.role === 'assistant'
                ? renderStructuredMessage(message.text)
                : renderInlineFormatting(message.text)}
            </div>
          ))
        )}
        {sending && <ThinkingBubble />}
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {QUICK_SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => appendQuickSuggestion(item)}
              className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700"
              disabled={!canChat}
            >
              {item}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="ඔබගේ ඕනෑම ගැටලුවක් මෙහි සඳහන් කරන්න..."
          rows={4}
          disabled={!canChat || sending || loadingCredits}
          className="mt-3 w-full rounded-2xl border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-indigo-400 disabled:bg-slate-100"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!canChat || sending || loadingCredits || !input.trim()}
          className="mt-3 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          {sending ? 'Preparing your reading...' : 'Send'}
        </button>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!canChat && !loadingCredits && (
        <div className="absolute inset-0 z-30 flex items-end bg-slate-900/45 p-4">
          <div className="w-full rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-xl">
            <h3 className="text-lg font-black text-slate-900">Consultation Credits අවසන්</h3>
            <p className="mt-2 text-sm text-slate-600">
              ඔබගේ free consultation sessions අවසන්. Continue කිරීමට පහත subscription plan එකක් තෝරන්න.
            </p>
            <div className="mt-4 space-y-3">
              <StripeCheckoutButton
                label="Basic Consultation (30 Msgs) - Rs. 200"
                customerEmail={userEmail}
                apiEndpoint="/api/consultant/create-checkout-session"
                payload={{ userId, packageCode: 'starter_200' }}
                className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white"
              />
              <StripeCheckoutButton
                label="Premium Consultation (100 Msgs) - Rs. 500"
                customerEmail={userEmail}
                apiEndpoint="/api/consultant/create-checkout-session"
                payload={{ userId, packageCode: 'premium_500' }}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologyConsultantScreen;
