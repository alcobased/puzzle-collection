# Project Overview

This project is a web application built with React and Vite. It appears to be a collection of puzzle games.

## Technologies Used

- **Frontend Framework:** React
- **Build Tool:** Vite
- **State Management:** Redux (with Redux Toolkit)
- **Styling:** CSS with variables for theming

## Project Structure

The project is organized into the following main directories:

- `src/components`: Contains React components, divided into `common`, `pages`, and `puzzles`.
- `src/features`: Contains Redux slices for different parts of the application state.
- `src/styles`: Contains global styles and theme definitions.

## Puzzles

The application includes the following puzzles:

- **Textris:** A [polyomino](https://en.wikipedia.org/wiki/Polyomino) packing puzzle game. The goal is to pack playing pieces on to a solution board in a particular way (to be determined). User creates the playing peaces by using Shapes section of control panel. Shapes (playing pieces) are placed on to Shapes board by default upon creation.
- **Pathfinder:** A puzzle that involves finding a path between two points on a grid. The grid can contain obstacles, and the player must find the shortest path around them. The application includes a solver that can find the optimal path.
- **Domino:** A domino-based puzzle where the player must place dominoes on a grid to match the numbers on adjacent dominoes. The goal is to fill the entire grid with dominoes.
