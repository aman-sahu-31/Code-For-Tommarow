export const initialAssessmentData = {
  questions: [],
  answer: {},   // ❗ should be an object, not 0
  timer: 180,
  status: "incomplete",
  index: 0,
};

export function reducer(state, action) {
  switch (action.type) {
    case "Start":
      return { ...state, questions: action.questions, status: "ongoing" };

    case "Answer":
      return {
        ...state,
        answer: {
          ...state.answer,
          [action.id]: action.option,  // ✅ FIXED (was action.options)
        },
      };

    case "Next":
      return {
        ...state,
        index: Math.min(state.index + 1, state.questions.length - 1),
      };

    case "Previous":
      return { ...state, index: Math.max(0, state.index - 1) };

    case "Timer":
      return { ...state, timer: state.timer - 1 };

    case "End":
      return { ...state, status: "complete" };

    default:
      return state;
  }
}
