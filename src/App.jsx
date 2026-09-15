import { useState } from "react";

const ANSWER = "NATURALISMO"; // depois trocamos pela resposta real
const CLUE_TEXT =
  "Sovina, brucutu e imoral, no fim não vi nem o b de \"bis\". O cortiço é o começo do movimento. (12)";

function App() {
  // separa a resposta em palavras, e cada palavra em letras
  const words = ANSWER.split(" ").map((word) => word.split(""));

  // guarda o que o usuário digitou, na mesma "forma" das palavras
  const [guess, setGuess] = useState(
    words.map((word) => word.map(() => ""))
  );

  const [status, setStatus] = useState(null); // null | "correct" | "wrong"
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  function handleChange(wordIndex, letterIndex, value) {
    const letter = value.slice(-1).toUpperCase(); // só a última letra digitada
    const next = guess.map((w) => [...w]); // copia profunda simples
    next[wordIndex][letterIndex] = letter;
    setGuess(next);
    setStatus(null);
  }

  function checkAnswer() {
    const userAnswer = guess.map((w) => w.join("")).join(" ");
    setStatus(userAnswer === ANSWER ? "correct" : "wrong");
  }

  function useHint() {
    // revela a próxima letra ainda não preenchida
    const flatAnswer = words.flat();
    const flatGuess = guess.flat();
    const nextEmptyIndex = flatGuess.findIndex((l) => l === "");
    if (nextEmptyIndex === -1) return;

    let count = 0;
    const next = guess.map((word) =>
      word.map((letter) => {
        if (count === nextEmptyIndex) {
          count++;
          return flatAnswer[count - 1];
        }
        count++;
        return letter;
      })
    );
    setGuess(next);
    setHintsUsed((h) => h + 1);
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-8 p-6">
      <div className="border border-purple-400 rounded-2xl px-8 py-6 max-w-xl text-center">
        <p className="text-zinc-100 text-lg">{CLUE_TEXT}</p>
      </div>

      <div className="flex gap-6">
        {words.map((word, wordIndex) => (
          <div key={wordIndex} className="flex gap-2">
            {word.map((_, letterIndex) => (
              <input
                key={letterIndex}
                maxLength={1}
                value={guess[wordIndex][letterIndex]}
                onChange={(e) =>
                  handleChange(wordIndex, letterIndex, e.target.value)
                }
                className="w-12 h-12 text-center text-xl uppercase bg-zinc-900 border border-purple-400 rounded-md text-white focus:outline-none focus:border-purple-300"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
  onClick={() => setShowHelp(true)}
  className="text-purple-300 border border-purple-400 rounded-full px-4 py-1 text-sm hover:bg-purple-400/10"
>
  Como jogar
</button>
        <button
          onClick={useHint}
          className="px-5 py-2 rounded-full border border-purple-400 text-purple-300 hover:bg-purple-400/10"
        >
          Dica ({hintsUsed})
        </button>
        <button
          onClick={checkAnswer}
          className="px-5 py-2 rounded-full bg-purple-500 text-white hover:bg-purple-400"
        >
          Conferir
        </button>
      </div>

      {status === "correct" && (
        <p className="text-green-400 text-lg">Certinho! 🎉</p>
      )}
      {status === "wrong" && (
        <p className="text-red-400 text-lg">Ainda não é isso, tenta de novo.</p>
      )}

      {showHelp && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
    <div className="bg-zinc-900 border border-purple-400 rounded-2xl max-w-md w-full p-6 relative">
      <button
        onClick={() => setShowHelp(false)}
        className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl"
      >
        ×
      </button>
      <h2 className="text-white text-xl font-bold mb-4">Como jogar</h2>
      <p className="text-zinc-300 mb-4">
        Nosso enigma é um quebra-cabeça linguístico, onde as palavras da
        frase escondem instruções de como montar a resposta final.
      </p>
      <p className="text-zinc-300 mb-2">
        Na frase, você encontra três tipos de elementos:
      </p>
      <ul className="text-zinc-300 space-y-2 mb-4">
        <li>
          <span className="text-purple-300 font-semibold">Indicadores</span>:
          palavras que dizem o que fazer — pegar o começo, o fim, remover
          uma letra, etc.
        </li>
        <li>
          <span className="text-green-300 font-semibold">Ingredientes</span>:
          palavras que você manipula conforme o indicador ao lado.
        </li>
        <li>
          <span className="text-blue-300 font-semibold">Conceito</span>:
          palavra ou trecho que indica o tema geral da resposta.
        </li>
      </ul>
      <p className="text-zinc-400 text-sm">
        Exemplo: "Omelete com bacon, por minha conta (5)" → pegando as
        letras de <b>bacon</b> conforme a instrução de "omelete" (misturar),
        e sabendo que o conceito é "minha conta", chegamos em{" "}
        <b>BANCO</b>.
      </p>
    </div>
  </div>
)}
    </div>
  );
}

export default App;