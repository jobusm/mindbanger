import { z } from 'zod';

export const MasterContentSchema = z.object({
  // English Fields
  theme_title_en: z.string().describe("Theme title. Short, punchy, max 5 words. E.g., 'Radical Ownership'."),
  daily_vibe_en: z.string().describe("3-4 adjectives describing the energy of the day."),
  text_of_day_en: z.string().describe("Main insight. 3 paragraphs. Use Markdown (bold key concepts). Par 1: Hook/Context. Par 2: Insight. Par 3: Directive."),
  microstep_en: z.string().describe("Actionable task to be done in < 2 mins. E.g., 'Cold shower 30s'."),
  meditation_en: z.string().describe("Structure: Phase 1 (Breath), Phase 2 (Visualization), Phase 3 (Anchor). Use Markdown."),
  affirmation_en: z.string().describe("Present tense. First person. Strong ('I am...')."),
  journal_question_en: z.string().describe("Deep introspective question."),
  keywords_en: z.string().describe("5-7 keywords, comma separated."),

  // Slovak Fields
  theme_title_sk: z.string().describe("Theme title in Slovak. Short, punchy. E.g., 'Radikálne Vlastnítctvo'."),
  daily_vibe_sk: z.string().describe("3-4 adjectives describing the energy in Slovak."),
  text_of_day_sk: z.string().describe("Main insight in Slovak. 3 paragraphs. Markdown."),
  microstep_sk: z.string().describe("Actionable task in Slovak."),
  meditation_sk: z.string().describe("Meditation structure in Slovak."),
  affirmation_sk: z.string().describe("Affirmation in Slovak."),
  journal_question_sk: z.string().describe("Journal question in Slovak."),
  keywords_sk: z.string().describe("Keywords in Slovak."),

  // Czech Fields
  theme_title_cs: z.string().describe("Theme title in Czech. Short, punchy."),
  daily_vibe_cs: z.string().describe("3-4 adjectives describing the energy in Czech."),
  text_of_day_cs: z.string().describe("Main insight in Czech. 3 paragraphs. Markdown."),
  microstep_cs: z.string().describe("Actionable task in Czech."),
  meditation_cs: z.string().describe("Meditation structure in Czech."),
  affirmation_cs: z.string().describe("Affirmation in Czech."),
  journal_question_cs: z.string().describe("Journal question in Czech."),
  keywords_cs: z.string().describe("Keywords in Czech."),

  // Visuals (Universal)
  image_prompt_en: z.string().describe("Midjourney prompt for the daily theme. Abstract, cinematic, high contrast, biohacker aesthetic."),
  
  // Meta
  season: z.string().optional().describe("Current season or astrological season."),
  zodiac: z.string().optional().describe("Current sun sign."),
  moon_phase: z.string().optional().describe("Current moon phase (New, Waxing, Full, Waning)."),
});

export type MasterContent = z.infer<typeof MasterContentSchema>;

export const DailyContentSchema = z.object({
  theme: z.string().describe("Short punchy theme (max 5 words)"),
  focus: z.string().describe("A 2-3 sentence explanation of why this theme matters today."),
  affirmation: z.string().describe("A powerful, first-person present tense affirmation related to the theme."),
  script: z.string().describe("A 45-60 second spoken word script expanding on the theme. Conversational, direct, inspiring tone.")
});

export type DailyContent = z.infer<typeof DailyContentSchema>;
