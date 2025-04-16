# Light & Shadow: A Balance Puzzle Game

## Tech Stack

- Phaser 3
- Typescript
- Vite

## Core Concept

A puzzle game where players must balance light and darkness in each level while managing their own exposure to these elements.

## Core Mechanics

### The Flip Ability

- Player can flip the state of interactive objects in the environment:
    - Light sources: On/Off
    - Obstacles: Solid/Transparent
    - Mirrors: Change reflection angle/properties
- **Charging Requirement**: Flipping requires a brief (1-2 second) charging period while standing still
    - Creates strategic positioning decisions
    - Adds tension as exposure meter continues to fill during charging

### Balance Exposure Timer

- Player has a Balance Meter that fills toward light when in bright areas and toward darkness in shadows
- If the meter maxes out on either end, player "burns" or is "consumed" and must restart
- Forces constant movement between light and shadow zones for survival
- Creates urgent gameplay where safe zones are temporary

### Level Goal

- Transform each puzzle room to achieve a balanced state (approximately 50% light/50% dark)
- Complete the puzzle while managing your own exposure meter

## Level Elements

### Basic Elements

- **Light Sources**: Various types with different intensities and patterns
- **Obstacles**: Block light and cast shadows - can be flipped between solid and transparent
- **Mirrors**: Redirect light beams - can be flipped to change angles
- **Floor Tiles**: Visually show the light/dark state of each area

### Level Progression Mechanics

- **Limited Actions**: Some levels restrict the number of flips
- **Balance Ripples**: Flipping one object affects nearby objects
- **Light/Dark Cycles**: Environmental lighting naturally cycles between states
- **Moving Elements**: Platforms or objects that move through the environment (introduced in later levels)
- **Balance Zones**: Special areas with unique properties

## Example Gameplay Scenarios

1. **Emergency Shadow**: Player starts in an overly bright room and must quickly create shadows before burning
2. **Light Cycle Challenge**: Complete the balance puzzle before automated light/dark cycles change the environment
3. **Chain Reaction**: Set up elaborate sequences where flipping one object triggers cascading changes
4. **Exposure Management**: Navigate through intensely bright or dark areas using brief exposures and careful timing
5. **Precision Timing**: Time flips with moving shadows or changing light conditions

## Art Style Considerations

- Light areas: Bright, warm colors with visible light rays
- Dark areas: Deep blues/purples (not just black) with subtle atmospheric effects
- Player character should show visual effects when approaching exposure limits
- Balance meter prominently displayed in UI
- Flip charging animation that communicates progress clearly

## Game Feel

- Movement should be fluid to facilitate the constant repositioning between light and shadow
- Flipping should feel satisfying with appropriate visual and audio feedback
- Exposure meter approaching limits should create tension through visual effects and warning sounds
- Achieving balance should have a satisfying payoff with visual celebration

## Level Design Principles

- Early levels teach core mechanics individually
- Middle levels combine mechanics in interesting ways
- Later levels introduce time pressure and complex chain reactions
- Final levels require mastery of exposure management while solving complex puzzles

This game design combines puzzle-solving with active movement challenges, creating a unique experience that embodies the theme of balance both in the puzzle objectives and the core survival mechanic.