import { useReducer, useEffect } from "react";
import { initialAssessmentData } from "../Components/Reducer";
import { reducer } from "../Components/Reducer";
import questions from "../Json Data/Assessment.json";

function Assessment() {
  const [state, dispatch] = useReducer(reducer, initialAssessmentData);
  //   const [selected , setSelected] = useState("");
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

  if (!question) return <h1>Loading...</h1>;
  if (state.status === "complete") {
    return (
      <div>
        <h1>Assessment Complete</h1>
        <p>
          Your Score: {Object.keys(state.answer).length} out of{" "}
          {state.questions.length}
        </p>
      </div>
    );
  }
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
