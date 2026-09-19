export const symptomOptions = [
  { id: "menstrual-pain", label: "Menstrual pain (cramps)", description: "Pain or cramping during your period" },
  { id: "pelvic-pain", label: "Pelvic pain", description: "Aching or pressure in the lower abdomen" },
  { id: "heavy-bleeding", label: "Heavy bleeding", description: "Needing to change protection very frequently or passing clots" },
  { id: "prolonged-bleeding", label: "Prolonged bleeding", description: "Periods that last longer than usual" },
  { id: "irregular-bleeding", label: "Irregular bleeding", description: "Unpredictable cycles or spotting between periods" },
  { id: "fatigue", label: "Fatigue", description: "Feeling unusually tired, especially around your period" },
  { id: "lower-back-pain", label: "Lower back pain", description: "Aching in the lower back, often cycle-related" },
  { id: "digestive-symptoms", label: "Digestive symptoms", description: "Bloating, nausea, or changes in digestion tied to your cycle" },
  { id: "headaches", label: "Headaches", description: "Headaches or migraines linked to your cycle" },
  { id: "pain-outside-menstruation", label: "Pain outside of menstruation", description: "Pelvic or related pain at other times of the month" },
  { id: "daily-impact", label: "Impact on daily life", description: "Symptoms that affect school, work, sleep, exercise, or daily activities" },
];

export const conditionSymptoms = {
  endometriosis: ["menstrual-pain", "pelvic-pain", "pain-outside-menstruation", "fatigue", "lower-back-pain", "digestive-symptoms", "daily-impact"],
  adenomyosis: ["menstrual-pain", "heavy-bleeding", "prolonged-bleeding", "pelvic-pain", "lower-back-pain", "fatigue"],
  "uterine-fibroids": ["heavy-bleeding", "prolonged-bleeding", "pelvic-pain", "lower-back-pain", "fatigue", "irregular-bleeding"],
  pcos: ["irregular-bleeding", "heavy-bleeding", "fatigue", "headaches"],
  "primary-dysmenorrhea": ["menstrual-pain", "lower-back-pain", "fatigue", "headaches", "digestive-symptoms", "daily-impact"],
};
