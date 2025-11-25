import { useReducer, useEffect } from "react";
import { initialAssessmentData } from "../Components/Reducer";
import { reducer } from "../Components/Reducer";
import questions from "../Json Data/Assessment.json";

function Assessment() {
  const [state, dispatch] = useReducer(reducer, initialAssessmentData);

  useEffect(() => {
    dispatch({ type: "Start", questions: questions });
  }, []);

  useEffect(() => {
    if (state.status === "ongoing" && state.timer > 0) {
      const timerId = setTimeout(() => {
        dispatch({ type: "Timer" });
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [state.status, state.timer]);

  useEffect(() => {
    if (state.timer === 0) {
      dispatch({ type: "End" });
    }
  }, [state.timer]);

  const question = state.questions[state.index];

  /* ============================================
        RESULT PAGE - NEW ATTRACTIVE UI
     ============================================ */
  if (state.status === "complete") {
    const score = Object.keys(state.answer).length;
    const total = state.questions.length;
    const percent = Math.round((score / total) * 100);

    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10 text-center relative">

          {/* TOP ICON */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white w-20 h-20 rounded-full flex justify-center items-center text-4xl shadow-xl">
            🎉
          </div>

          {/* HEADING */}
          <h1 className="text-3xl font-bold text-gray-800 mt-10">
            Assessment Complete!
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Great job completing your test.
          </p>

          {/* SCORE CARD */}
          <div className="mt-8 bg-gray-100 p-6 rounded-2xl shadow-inner">
            <h2 className="text-5xl font-extrabold text-green-600">{percent}%</h2>
            <p className="text-gray-700 mt-2 text-lg font-medium">
              You scored {score} out of {total}
            </p>
          </div>

          {/* FEEDBACK */}
          <p className="mt-6 text-gray-600 text-lg italic">
            {percent >= 80
              ? "🔥 Excellent Performance!"
              : percent >= 50
              ? "👍 Good job, keep improving!"
              : "📚 Keep practicing, you can do better!"}
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col gap-4">
            <button
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg transition-all"
              onClick={() => window.location.reload()}
            >
              Retake Test
            </button>

            <button
              className="w-full py-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold text-lg shadow"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================
        MAIN ASSESSMENT SCREEN
     ============================================ */
  if (!question) return <h1>Loading...</h1>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative">
        
        {/* TIMER */}
        <div className="absolute top-4 right-4 bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl shadow">
          ⏳ {state.timer}s
        </div>

        {/* QUESTION NUMBER */}
        <p className="text-sm text-gray-500 mb-1">
          Question {state.index + 1} / {state.questions.length}
        </p>

        {/* QUESTION TEXT */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {question.text}
        </h1>

        {/* OPTIONS */}
        <div className="space-y-4">
          {question.options.map((opt, i) => {
            const isSelected = state.answer[String(question.id)] === opt;

            return (
              <label
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all
                  ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-700 shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                  }
                `}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={isSelected}
                  onChange={() =>
                    dispatch({ type: "Answer", id: question.id, option: opt })
                  }
                  className="h-5 w-5 accent-blue-600"
                />

                <span className="font-medium text-lg">{opt}</span>
              </label>
            );
          })}
        </div>

        {/* BUTTON SECTION */}
        <div className="flex justify-between items-center mt-10 pt-5 border-t">
          <button
            onClick={() => dispatch({ type: "Previous" })}
            disabled={state.index === 0}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 disabled:opacity-40 rounded-xl font-semibold text-gray-800 shadow"
          >
            Previous
          </button>

          <button
            onClick={() => dispatch({ type: "Next" })}
            disabled={state.index === state.questions.length - 1}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-semibold shadow"
          >
            Next
          </button>
        </div>

        {/* SUBMIT BUTTON */}
        {state.index === state.questions.length - 1 && (
          <button
            onClick={() => dispatch({ type: "End" })}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-xl font-bold shadow-lg transition-all"
          >
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}

export default Assessment;
