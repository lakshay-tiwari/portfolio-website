export { PixelCatCompanion } from "./PixelCatCompanion";
export type { PixelCatProps, CatDirection } from "./PixelCatCompanion";
export { SPEED, IDLE_RADIUS, TICK_RATE_MS, SPRITE_SETS } from "./PixelCatCompanion";

// Alias for backwards compatibility with any existing companion references
export { PixelCatCompanion as DogCursorCompanion } from "./PixelCatCompanion";
export { DogCharacter } from "./DogCharacter";
export { PawTrail } from "./PawTrail";
export { SpeechBubble } from "./SpeechBubble";
export { useDogPersonality } from "./useDogPersonality";
export { useDogMotion } from "./useDogMotion";
export { useCursorTracking } from "./useCursorTracking";
export { DEFAULT_DOG_CONFIG } from "./dogMotionConfig";
export type {
  DogMotionConfig,
  DogAnimationState,
  DogDirection,
  DogIdleGesture,
  DogReactionType,
  DogPersonalityConfig,
} from "./dogMotionConfig";
export type { DogCharacterProps } from "./DogCharacter";
export type { PawTrailHandle, PawTrailProps } from "./PawTrail";
export type { SpeechBubbleProps } from "./SpeechBubble";
export * from "./corgiPixelFrames";
export * from "./pixelFrames";
