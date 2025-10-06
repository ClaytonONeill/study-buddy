import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Card = { id: string; question: string; answer: string };
const STORAGE_KEY = "flashcards_minimal_v2";

const FlashCards: React.FC = () => {
  const [exam, setExam] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
   const navigate = useNavigate();
  
   

  // Deck mode state
  const [deckActive, setDeckActive] = useState(false);
  const [deckOrder, setDeckOrder] = useState<number[]>([]);
  const [deckIdx, setDeckIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shuffleOnStart, setShuffleOnStart] = useState(true);

  // Load saved cards
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setCards(JSON.parse(raw));
    } catch {}
  }, []);

  // Save on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {}
  }, [cards]);

  const makeBlank15 = () => {
    setCards(
      Array.from({ length: 15 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        question: "",
        answer: "",
      }))
    );
  };

  const clearAll = () => {
    setCards([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // Build the deck with indices of cards that have a question
  const startDeck = () => {
    const idxs = cards
      .map((c, i) => ({ i, q: c.question?.trim() }))
      .filter((x) => x.q)
      .map((x) => x.i);

    if (idxs.length === 0) {
      alert("Add at least one card with a question before starting the deck.");
      return;
    }
    if (shuffleOnStart) {
      for (let i = idxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
      }
    }
    setDeckOrder(idxs);
    setDeckIdx(0);
    setRevealed(false);
    setDeckActive(true);
  };

  const exitDeck = () => {
    setDeckActive(false);
    setRevealed(false);
  };

  const canPrev = deckIdx > 0;
  const canNext = deckIdx < deckOrder.length - 1;

  const goPrev = () => {
    if (!canPrev) return;
    setDeckIdx((i) => i - 1);
    setRevealed(false);
  };
  const goNext = () => {
    if (!canNext) return;
    setDeckIdx((i) => i + 1);
    setRevealed(false);
  };

  // Keyboard shortcuts in deck: ←/→ navigate, Space show/hide, Esc exit
  useEffect(() => {
    if (!deckActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === " ") {
        e.preventDefault();
        setRevealed((s) => !s);
      } else if (e.key === "Escape") {
        e.preventDefault();
        exitDeck();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckActive, deckIdx, deckOrder.length]);

  // Current deck card
  const currentCard: Card | null = useMemo(() => {
    if (!deckActive || deckOrder.length === 0) return null;
    return cards[deckOrder[deckIdx]] ?? null;
  }, [deckActive, deckOrder, deckIdx, cards]);

  return (
    
    <div className="p-6 max-w-6xl mx-auto">
         <button
         onClick={() => navigate(-1)}
         className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
         >
          ← back to dashboard
         </button>
      <div className="rounded-2xl border border-slate-200 bg-white shadow"> 
        <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">  
          <h1 className="text-xl font-semibold text-white">
            Flashcards {exam ? `— ${exam}` : ""}  
          </h1>
        </div>
        {/* Controls */}
        {!deckActive ? (
          <div className="px-6 pt-6 pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Exam / Topic
              </label>
              <div className="flex gap-3">
                
                <input
                  className="input flex-1"
                  placeholder="e.g., CompTIA Security+"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                />
                <button
                  type="button"
                  onClick={makeBlank15}
                  disabled={!exam.trim()}
                  className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-60 hover:bg-blue-700"
                >
                  Create deck
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={cards.length === 0}
                  className="rounded-lg bg-red-600 text-white px-4 py-2 disabled:opacity-60"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={shuffleOnStart}
                  onChange={(e) => setShuffleOnStart(e.target.checked)}
                />
                Shuffle deck on start
              </label>
              <button
                type="button"
                onClick={startDeck}
                disabled={cards.every((c) => !c.question.trim())}
                className="rounded-lg bg-slate-900 text-white px-4 py-2 disabled:opacity-50"
              >
                Start Deck
              </button>
            </div>
          </div>
        ) : (
          // Deck header bar
          <div className="px-6 pt-6 pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              {deckOrder.length > 0 ? (
                <>
                  Card <span className="font-medium">{deckIdx + 1}</span> /{" "}
                  <span className="font-medium">{deckOrder.length}</span>
                </>
              ) : (
                "No cards"
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exitDeck}
                className="rounded-lg bg-slate-100 text-slate-800 px-4 py-2 hover:bg-slate-200"
                title="Esc"
              >
                Exit Deck
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6">
          {!deckActive ? (
            // EDITOR GRID
            cards.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Enter an exam and click “Create Deck”.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((c, i) => (
                  <EditCard
                    key={c.id}
                    idx={i + 1}
                    card={c}
                    onChangeQ={(val) =>
                      setCards((prev) => {
                        const arr = [...prev];
                        arr[i] = { ...arr[i], question: val };
                        return arr;
                      })
                    }
                    onChangeA={(val) =>
                      setCards((prev) => {
                        const arr = [...prev];
                        arr[i] = { ...arr[i], answer: val };
                        return arr;
                      })
                    }
                    onDelete={() =>
                      setCards((prev) => prev.filter((x) => x.id !== c.id))
                    }
                  />
                ))}
              </div>
            )
          ) : (
            // DECK MODE (single card)
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <div className="mb-3 text-xs text-slate-500">
                  Use ← / → to navigate, Space to show/hide, Exit Deck to exit
                </div>

                <div className="font-medium mb-4 whitespace-pre-wrap min-h-[3rem]">
                  {currentCard?.question || (
                    <span className="italic text-slate-400">No question</span>
                  )}
                </div>

                {revealed ? (
                  <div className="text-sm text-slate-700 mb-6 whitespace-pre-wrap min-h-[4rem]">
                    {currentCard?.answer || (
                      <span className="italic text-slate-400">No answer</span>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 mb-6 italic min-h-[4rem]">
                    (Press Space or click “Show Answer”)
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRevealed((s) => !s)}
                    className="rounded-md bg-slate-900 text-white text-sm px-4 py-2 hover:bg-black"
                  >
                    {revealed ? "Hide Answer" : "Show Answer"}
                  </button>
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="rounded-md bg-slate-100 text-slate-800 text-sm px-4 py-2 disabled:opacity-50 hover:bg-slate-200"
                    title="←"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="rounded-md bg-slate-100 text-slate-800 text-sm px-4 py-2 disabled:opacity-50 hover:bg-slate-200"
                    title="→"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// EDIT MODE card
const EditCard: React.FC<{
    
  idx: number;
  card: Card;
  onChangeQ: (val: string) => void;
  onChangeA: (val: string) => void;
  onDelete: () => void;
}> = ({ idx, card, onChangeQ, onChangeA, onDelete }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-slate-500">Card {idx}</div>
        <button
          className="text-xs text-red-600 hover:underline"
          onClick={onDelete}
          type="button"
        >
          Clear Card
        </button>
      </div>

      <label className="block text-xs text-slate-500 mb-1">Question</label>
      <textarea
        className="input h-20 mb-3"
        value={card.question}
        onChange={(e) => onChangeQ(e.target.value)}
      />

      <label className="block text-xs text-slate-500 mb-1">Answer</label>
      <textarea
        className="input h-20"
        value={card.answer}
        onChange={(e) => onChangeA(e.target.value)}
      />
    </div>
    
  );
};

export default FlashCards;
