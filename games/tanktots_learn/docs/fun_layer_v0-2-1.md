# TankTots Learn v0.2.1 Fun Layer

The v0.2.1 runtime patch turns the learning deck from a static card viewer into a small toddler-friendly game-show loop.

## Runtime moments

1. Deck selected: speaks the deck name.
2. Card appears: asks a deck-aware question.
3. Answer button/card tap: reveals the answer with praise, caption, card pop, reward sticker, sparkles, confetti, and WebAudio chime.

## Optional deck fields

```json
{
  "spokenTitle": "Colors!",
  "question": "What color is this?",
  "praise": ["Good job!", "Awesome!"],
  "answerTemplate": "{answer}! The {object} is {answer}. {praise}"
}
```

## Optional card fields

```json
{
  "title": "Gray",
  "answer": "gray",
  "object": "elephant",
  "answerText": "Gray! The elephant is gray. Good job!"
}
```

If `answerText` or `funText` is present, the runtime uses it. Otherwise it builds a phrase from the card and deck context. Legacy `soundText` values like `This is red.` are treated as boring fallback text and replaced with the richer runtime phrase.
