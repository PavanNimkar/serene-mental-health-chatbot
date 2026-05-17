# apps/tests_app/data.py

ALL_QUESTIONS = {
    "PHQ-9": [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling or staying asleep, or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        "Trouble concentrating on things, such as reading the newspaper or watching television",
        "Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual",
        "Thoughts that you would be better off dead, or of hurting yourself in some way",
    ],
    "GAD-7": [
        "Feeling nervous, anxious, or on edge",
        "Not being able to stop or control worrying",
        "Worrying too much about different things",
        "Trouble relaxing",
        "Being so restless that it's hard to sit still",
        "Becoming easily annoyed or irritable",
        "Feeling afraid as if something awful might happen",
    ],
}

ANSWER_OPTIONS = [
    {"label": "Not at all", "value": 0},
    {"label": "Several days", "value": 1},
    {"label": "More than half the days", "value": 2},
    {"label": "Nearly every day", "value": 3},
]

MAX_SCORES = {
    "PHQ-9": 27,
    "GAD-7": 21,
}


def _phq9_score(score):
    if score <= 4:
        return (
            "minimal",
            "Minimal depression. Your symptoms are few and cause little distress.",
        )
    elif score <= 9:
        return (
            "mild",
            "Mild depression. Consider monitoring your symptoms and self-care strategies.",
        )
    elif score <= 14:
        return (
            "moderate",
            "Moderate depression. Speaking with a mental health professional is recommended.",
        )
    elif score <= 19:
        return (
            "moderately_severe",
            "Moderately severe depression. Professional support is strongly recommended.",
        )
    else:
        return (
            "severe",
            "Severe depression. Please reach out to a mental health professional as soon as possible.",
        )


def _gad7_score(score):
    if score <= 4:
        return (
            "minimal",
            "Minimal anxiety. Your symptoms are minimal and unlikely to interfere with daily life.",
        )
    elif score <= 9:
        return (
            "mild",
            "Mild anxiety. Consider relaxation techniques and monitoring your stress levels.",
        )
    elif score <= 14:
        return (
            "moderate",
            "Moderate anxiety. Speaking with a mental health professional is recommended.",
        )
    else:
        return (
            "severe",
            "Severe anxiety. Please reach out to a mental health professional as soon as possible.",
        )


SCORING_FUNCTIONS = {
    "PHQ-9": _phq9_score,
    "GAD-7": _gad7_score,
}
