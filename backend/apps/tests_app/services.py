PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself — or that you are a failure?",
    "Trouble concentrating on things?",
    "Moving or speaking so slowly that other people could have noticed?",
    "Thoughts that you would be better off dead or hurting yourself?",
]

GAD7_QUESTIONS = [
    "Feeling nervous, anxious, or on edge?",
    "Not being able to stop or control worrying?",
    "Worrying too much about different things?",
    "Trouble relaxing?",
    "Being so restless that it's hard to sit still?",
    "Becoming easily annoyed or irritable?",
    "Feeling afraid as if something awful might happen?",
]

ANSWER_OPTIONS = [
    {"value": 0, "label": "Not at all"},
    {"value": 1, "label": "Several days"},
    {"value": 2, "label": "More than half the days"},
    {"value": 3, "label": "Nearly every day"},
]


def compute_phq9(score: int) -> tuple[str, str]:
    if score <= 4:
        return "minimal", "Minimal depression. No action likely needed."
    elif score <= 9:
        return "mild", "Mild depression. Consider watchful waiting."
    elif score <= 14:
        return "moderate", "Moderate depression. Consider counseling or therapy."
    else:
        return "severe", "Severe depression. Active treatment recommended."


def compute_gad7(score: int) -> tuple[str, str]:
    if score <= 4:
        return "minimal", "Minimal anxiety."
    elif score <= 9:
        return "mild", "Mild anxiety. Monitor symptoms."
    elif score <= 14:
        return "moderate", "Moderate anxiety. Consider therapy."
    else:
        return "severe", "Severe anxiety. Seek professional help."


SCORING_FUNCTIONS = {"PHQ-9": compute_phq9, "GAD-7": compute_gad7}
MAX_SCORES = {"PHQ-9": 27, "GAD-7": 21}
ALL_QUESTIONS = {"PHQ-9": PHQ9_QUESTIONS, "GAD-7": GAD7_QUESTIONS}
