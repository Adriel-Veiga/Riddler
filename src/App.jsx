//INDEX
import { useState, useRef } from "react";

const ANSWER = "NATURALISMO";
const CLUE_TEXT =
  "Sovina, brucutu e imoral, no fim não vi nem o b de \"bis\". O cortiço é o começo do movimento literário. (12)";
//lógica da aplicação, inputs, dicas, etc
function App() {
  //definição das variáveis e estados do jogo
  const words = ANSWER.split(" ").map((word) => word.split(""));
  const [guess, setGuess] = useState(words.map((word) => word.map(() => "")));
  const [status, setStatus] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const inputRefs = useRef([]);
//função para digitação fluída dos inputs
  function focusInput(wordIndex, letterIndex) {
    if (letterIndex >= words[wordIndex].length) {
      const nextWord = wordIndex + 1;
      if (nextWord < words.length) focusInput(nextWord, 0);
      return;
    }
    inputRefs.current[wordIndex]?.[letterIndex]?.focus();
  }
//função para digitação e atualização do estado do jogo
  function handleChange(wordIndex, letterIndex, value) {
    const letter = value.slice(-1).toUpperCase();
    const next = guess.map((w) => [...w]);
    next[wordIndex][letterIndex] = letter;
    setGuess(next);
    setStatus(null);

    if (letter) {
      focusInput(wordIndex, letterIndex + 1);
    }
  }
//função para lidar com eventos de teclado, como Enter e Backspace
  function handleKeyDown(e, wordIndex, letterIndex) {
    if (e.key === "Enter") {
      checkAnswer();
      return;
    }

    if (e.key === "Backspace" && !guess[wordIndex][letterIndex]) {
      if (letterIndex > 0) {
        focusInput(wordIndex, letterIndex - 1);
      } else if (wordIndex > 0) {
        focusInput(wordIndex - 1, words[wordIndex - 1].length - 1);
      }
    }
  }
//função para verificar se a resposta do usuário está correta
  function checkAnswer() {
    const userAnswer = guess.map((w) => w.join("")).join(" ");
    setStatus(userAnswer === ANSWER ? "correct" : "wrong");
  }
//"Html" + "Css" da página (no caso é a base do react + tailwind css)
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-6 sm:gap-8 p-4 sm:p-6">
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-5">
        <h1 className="text-white text-base sm:text-lg font-semibold tracking-wide">
          O Cortiço <span className="text-lime">/ enigma</span>
        </h1>
        <button
          onClick={() => setShowHelp(true)}
          className="text-violet border border-violet rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm hover:bg-violet/10 transition-colors"
        >
          Como jogar
        </button>
      </header>

      <div className="border border-violet rounded-2xl px-4 sm:px-8 py-5 sm:py-6 max-w-xl text-center">
        <p className="font-serif-riddle text-zinc-100 text-base sm:text-lg leading-relaxed">
          {CLUE_TEXT}
        </p>
      </div>

      <div className="flex gap-2 sm:gap-6 flex-wrap justify-center px-2">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="flex gap-2">
            {word.map((_, letterIndex) => (
              <input
                key={letterIndex}
                ref={(el) => {
                  if (!inputRefs.current[wordIndex]) inputRefs.current[wordIndex] = [];
                  inputRefs.current[wordIndex][letterIndex] = el;
                }}
                maxLength={1}
                disabled={status === "correct"}
                value={guess[wordIndex][letterIndex]}
                onChange={(e) =>
                  handleChange(wordIndex, letterIndex, e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, wordIndex, letterIndex)}
                className="w-8 h-10 sm:w-11 sm:h-12 text-center text-base sm:text-xl uppercase bg-ink border border-violet rounded-md text-white focus:outline-none focus:border-lime transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              />
            ))}
          </div>
        ))}
      </div>

      {status !== "correct" && (
        <div className="flex gap-4">
          <button
            onClick={useHint}
            className="px-5 py-2 rounded-full border border-violet text-violet hover:bg-violet/10 transition-colors"
          >
            Dica ({hintsUsed})
          </button>
          <button
            onClick={checkAnswer}
            className="px-6 py-2 rounded-full bg-lime text-ink font-semibold hover:brightness-110 transition"
          >
            Conferir
          </button>
        </div>
      )}

      {status === "wrong" && (
        <p className="text-red-400 text-lg">Ainda não é isso, tenta de novo.</p>
      )}

      {status === "correct" && (
        <div className="animate-pop-in border-2 border-lime rounded-2xl px-8 py-6 bg-lime/10 text-center max-w-md">
          <p className="text-lime text-xl font-semibold">
            Isso mesmo, é NATURALISMO!
          </p>
          <p className="text-zinc-300 text-sm mt-2">
            O Cortiço é uma das obras que inaugura o movimento no Brasil.
          </p>
        </div>
      )}

      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-ink border border-violet rounded-2xl max-w-md w-full p-5 sm:p-6 relative max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl"
            >
              ×
            </button>
            <h2 className="text-white text-xl font-bold mb-4">Como jogar</h2>
            <p className="text-zinc-300 mb-4">
              Esse enigma é um quebra-cabeça linguístico inspirada no https://enigmati.co/! Onde as palavras
              da frase escondem instruções de como montar a resposta final.
            </p>
            <p className="text-zinc-300 mb-2">
              Na frase, você encontra três tipos de elementos:
            </p>
            <ul className="text-zinc-300 space-y-2 mb-4">
              <li>
                <span className="text-violet font-semibold">Indicadores</span>:
                palavras que dizem o que fazer — pegar o começo, o fim,
                remover uma letra, etc.
              </li>
              <li>
                <span className="text-lime font-semibold">Ingredientes</span>:
                palavras que você manipula conforme o indicador ao lado.
              </li>
              <li>
                <span className="text-blue-300 font-semibold">Conceito</span>:
                palavra ou trecho que indica o tema geral da resposta.
              </li>
            </ul>
            <p className="text-zinc-400 text-sm">
              Exemplo: "Omelete com bacon, por minha conta (5)" → pegando as
              letras de <b>bacon</b> conforme a instrução de "omelete"
              (misturar), e sabendo que o conceito é "minha conta", chegamos
              em <b>BANCO</b>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;