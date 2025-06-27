'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useQuestionStore } from '@/app/store/questionStore';
import { Skeleton } from "@/components/ui/skeleton"


import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  JSX,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';

// Lazy-loaded components for performance optimization
const HomeNavbar = dynamic(() => import('@/components/HomeNavbar'), {
  ssr: false,
});
const Breadcrumbs = dynamic(() => import('@/components/Breadcrumbs'), {
  ssr: false,
});
const BlockMath = dynamic(() => import('react-katex').then((mod) => mod.BlockMath), {
  ssr: false,
});
const InlineMath = dynamic(() => import('react-katex').then((mod) => mod.InlineMath), {
  ssr: false,
});

import 'katex/dist/katex.min.css';

interface QuestionType {
  _id: string;
  seed: string;
  question: string;
  options: string[];
  correctOption: string;
  subject?: string;
  topic?: string;
  solvedBy: number;
}

const optionLabels = ['a', 'b', 'c', 'd'];

const OptionButton = React.memo(
  ({
    idx,
    option,
    isSelected,
    isCorrect,
    disabled,
    onClick,
  }: {
    idx: number;
    option: string;
    isSelected: boolean;
    isCorrect: boolean;
    disabled: boolean;
    onClick: () => void;
  }) => {
    let btnClass = 'border px-6 py-2 rounded-lg cursor-pointer transition duration-300 ';
    if (disabled) {
      if (isCorrect) btnClass += 'bg-green-500 text-white';
      else if (isSelected) btnClass += 'bg-red-500 text-white';
      else btnClass += 'opacity-70 bg-slate-500';
    } else {
      btnClass += 'bg-slate-500 hover:bg-slate-600';
    }
    return (
      <button onClick={onClick} disabled={disabled} className={btnClass} key={idx}>
        {option}
      </button>
    );
  }
);

export default function FullscreenScrollFeed() {
  const [Point, setPoint] = useState<number>(0);
  const [AllowScrolling, setAllowScrolling] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [posts, setPosts] = useState<QuestionType[]>([]);
  const [page, setPage] = useState(1);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const { data: session } = useSession();
  const CorrectaudioRef = useRef<HTMLAudioElement | null>(null);
  const InCorrectaudioRef = useRef<HTMLAudioElement | null>(null);
  const storedPosts = useQuestionStore((state) => state.questions);


  const fetchQuestions = useCallback(
    async (pageNumber: number) => {
      if (questionLoading || !hasMore) return;
      setQuestionLoading(true);

      try {
        const res = await fetch(`/api/getQuestions?page=${pageNumber}&limit=5`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session?.user?.email }),
        });
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          // Shuffle only the new chunk
          const shuffledChunk = [...data.data].sort(() => 0.5 - Math.random());

          setPosts((prev) => {
            const combined = [...prev, ...shuffledChunk];
            const uniqueMap = new Map<string, QuestionType>();
            combined.forEach((q) => uniqueMap.set(q._id, q));
            return Array.from(uniqueMap.values());
          });

          setHasMore(data.data.length === 5);
          setPage((prev) => prev + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setHasMore(false);
      } finally {
        setQuestionLoading(false);
      }
    },
    [questionLoading, hasMore, session?.user?.email]
  );

  // Debounced infinite scroll handler
  const handleInView = useMemo(
    () =>
      debounce(() => {
        if (hasMore && !questionLoading) {
          fetchQuestions(page);
        }
      }, 300),
    [hasMore, questionLoading, fetchQuestions, page]
  );

  useEffect(() => {
    if (session?.user?.email) {
      fetchQuestions(page);
      fetchPoint({ operator: '', email: session.user.email });
    }
  }, [session]);


  useEffect(() => {
    if (inView) {
      handleInView();
    }
  }, [inView, handleInView]);

  useEffect(() => {
    setAllowScrolling(false);
  }, [posts.length]);


  const fetchPoint = async ({ operator, email }: any) => {

    console.log("Email to be sent is" + session?.user?.email)

    const response = await fetch('/api/forPoints/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: operator, email: session?.user?.email }),
    });
    const responseMessage = await response.json();
    console.log(responseMessage.status)

    setPoint(responseMessage.newPoint);

  }

  const handleOptionClick = useCallback(
    (post: QuestionType, selectedIndex: number) => {
      const selectedLetter = optionLabels[selectedIndex];

      // 1. Update UI immediately
      setAllowScrolling(true);
      setUserAnswers((prev) => ({ ...prev, [post._id]: selectedLetter }));

      if (selectedLetter === post.correctOption) {
        CorrectaudioRef.current?.pause();
        CorrectaudioRef.current!.currentTime = 0;
        CorrectaudioRef.current?.play().catch(console.log);
        toast.success('Correct. Point +1⭐');
        fetchPoint({ operator: '+' });
      } else {
        InCorrectaudioRef.current?.pause();
        InCorrectaudioRef.current!.currentTime = 0;
        InCorrectaudioRef.current?.play().catch(console.log);
        toast.error('Incorrect. Point -2⭐');
        fetchPoint({ operator: '-' });
      }

      // 2. Fire POST request in background — no await to avoid blocking UI
      fetch('/api/seenQuestions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: post.seed, email: session?.user?.email }),
      }).catch((error) => {
        console.error('Error marking question as seen:', error);
        // Optional: Show error toast but don’t rollback UI
        toast.error('Network error, answer might not be saved.');
      });
    },
    [fetchPoint, session?.user?.email]
  );






  const askAI = useCallback(async (questionText: string) => {
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/forSolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText }),
      });
      const data = await res.json();
      setAnswer(data.answer || 'Solution unavailable at this moment.');
    } catch (error) {
      setAnswer('Failed to get solution.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);





  const handleBack = useCallback(() => setAnswer(''), []);

  // Memoized math render helper
  const renderWithMath = useMemo(
    () => (text: string) => {
      const inlineRegex = /\\\((.+?)\\\)/g;
      const parts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      let match;
      while ((match = inlineRegex.exec(text)) !== null) {
        const [raw, math] = match;
        const index = match.index;
        parts.push(text.slice(lastIndex, index));
        parts.push(<InlineMath key={index} math={math} />);
        lastIndex = index + raw.length;
      }
      parts.push(text.slice(lastIndex));
      return <>{parts}</>;
    },
    []
  );

  const renderAnswer = useCallback(
    (text: string) => {
      const lines = text.split('\n');
      const elements: (JSX.Element | string)[] = [];
      let insideBlock = false;
      let blockBuffer: string[] = [];
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('\\[')) {
          insideBlock = true;
          blockBuffer.push(trimmed.replace('\\[', ''));
        } else if (trimmed.endsWith('\\]')) {
          insideBlock = false;
          blockBuffer.push(trimmed.replace('\\]', ''));
          const fullBlock = blockBuffer.join(' ');
          elements.push(<BlockMath key={idx} math={fullBlock} />);
          blockBuffer = [];
        } else if (insideBlock) {
          blockBuffer.push(trimmed);
        } else {
          elements.push(
            <div key={idx} className="mb-2 leading-relaxed">
              {renderWithMath(trimmed)}
            </div>
          );
        }
      });
      return elements;
    },
    [renderWithMath]
  );

  return (
    <div className="h-screen w-screen bg-slate-400 overflow-hidden">
      <audio ref={CorrectaudioRef} src="/correct.ogg" preload="auto" />
      <audio ref={InCorrectaudioRef} src="/error.ogg" preload="auto" />

      <Toaster
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #713200',
            padding: '5px 40px',
            color: '#713200',
          },
        }}
        position="bottom-center"
        reverseOrder={true}
      />

      <div className=''><HomeNavbar /></div>

      <div className="rankShow mt-2  flex flex-row item-center gap-2 overflow-hidden justify-center text-center text-sm">
        <h2>
          Hey {session?.user?.name}, Your Current Points is {Point}.
        </h2>
        <Link href="/home/Leaderboard">
          <h2 className="underline text-blue-600">See Leaderboard</h2>
        </Link>
      </div>

      <div
        className={
          AllowScrolling
            ? 'h-[90vh] mt-8 overflow-y-scroll no-scrollbar snap-y snap-mandatory'
            : 'h-[90vh] mt-8 overflow-hidden no-scrollbar snap-y snap-mandatory'
        }
      >
        {posts.map((post) => {
          const userSelected = userAnswers[post._id];
          return (
            <motion.div
              key={post._id}
              className="h-[90vh] snap-start flex flex-col items-center text-black"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            >
              <div className="questionCard text-white h-[70%] w-[90%] bg-slate-500 flex flex-col justify-start gap-4 p-4 rounded-2xl">
                <div className="w-full flex flex-row justify-evenly">
                  <Breadcrumbs
                    solvedBy={post.solvedBy}
                    subject={post.subject}
                    topic={post.topic}
                  />
                </div>

                <div className="actualQuestion">
                  <h1 className="text-start ml-1 text-[14px]">
                    {renderAnswer(post.question)}
                  </h1>
                </div>

                <div className="options flex flex-col gap-2">
                  {post.options.map((opt, idx) => {
                    const optLetter = optionLabels[idx];
                    const isSelected = userSelected === optLetter;
                    const isCorrect = post.correctOption === optLetter;
                    return (
                      <OptionButton
                        key={idx}
                        idx={idx}
                        option={opt}
                        isSelected={isSelected}
                        isCorrect={isCorrect}
                        disabled={!!userSelected}
                        onClick={() => handleOptionClick(post, idx)}
                      />
                    );
                  })}
                </div>

                <div className="supportButtons mt-2 flex flex-row justify-evenly items-center w-full">
                  <button className="bg-green-500 text-white px-4 py-1 rounded-lg">
                    Easy 70
                  </button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded-lg">
                    Difficult 20
                  </button>
                  <button

                  

                    className="bg-fuchsia-600 text-white cursor-pointer px-4 py-1 rounded-lg"
                  >
                    Get Solution
                  </button>
                </div>

                <div className="min-h-[200px]">
                  {/* Reserve space to prevent layout shift */}
                  {loading && (
                    <div className="p-3 bg-white text-black h-2/3 text-center w-[90%] flex flex-col items-center justify-center gap-10 rounded-md shadow z-50">
                      Loading Solution...
                    </div>
                  )}

                  {answer && (
                    <div className="p-3 bg-white fixed overflow-scroll text-black w-[90%] h-[60vh] top-40 text-start flex flex-col items-start gap-6 rounded-md shadow z-40">
                      <button
                        onClick={handleBack}
                        className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                      >
                        Back
                      </button>
                      <div className="text-sm">{renderAnswer(answer)}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {questionLoading && (
          <div className="flex flex-col h-[90vh] w-screen justify- items-center space-y-3">
            <Skeleton className="h-2/3 w-2/3 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-1/2 w-[250px]" />
              <Skeleton className="h-1/2 w-[200px]" />
            </div>
          </div>
        )}


        {!hasMore && (
          <div className="h-screen w-screen flex justify-center items-center">
            You have Checked All Posts. Come Back Later.
          </div>
        )}
      </div>
    </div>
  );
}
