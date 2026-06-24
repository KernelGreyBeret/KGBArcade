# TankTots Learn Animated Deck Schema

TankTots Learn v0.2 supports static image cards and animated frame-sequence cards in the same deck.

## Static card

```json
{
  "id": "red",
  "title": "Red",
  "emoji": "❤️",
  "image": "images/red.png",
  "spoken": "Red",
  "soundText": "This is red.",
  "prompt": "This is red.",
  "mode": "name_sound"
}
```

## Animated card

```json
{
  "id": "wave",
  "type": "animated",
  "title": "Wave",
  "spoken": "Wave",
  "soundText": "Wave!",
  "prompt": "This is wave.",
  "frames": [
    "images/wave_01.png",
    "images/wave_02.png",
    "images/wave_03.png",
    "images/wave_04.png"
  ],
  "fps": 8,
  "loop": true,
  "audio": "audio/wave.mp3"
}
```

## Deck defaults

```json
{
  "cardDefaults": {
    "fps": 8,
    "loop": true
  }
}
```

## Detection rules

1. If `card.type === "animated"` and `card.frames` exists, the engine plays the frame sequence.
2. Else if `card.image` exists, the engine shows the static image.
3. Else, the engine shows a friendly placeholder.

All paths are relative to the deck folder.
