"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { makeMove, checkWinner, getAIMove } from "@/lib/game-logic"
import { COLUMNS, ROWS, EMPTY, PLAYER, AI, GameState, Difficulty, GameMode } from "@/lib/constants"

type GameContextType = {
  gameState: GameState
  board: number[][]
  currentPlayer: number
  winner: number | null
  isDraw: boolean
  difficulty: Difficulty
  gameMode: GameMode
  playerOneName: string
  playerTwoName: string
  isNameModalOpen: boolean
  dropDisc: (column: number) => void
  resetGame: () => void
  setDifficulty: (difficulty: Difficulty) => void
  setGameMode: (mode: GameMode) => void
  setPlayerOneName: (name: string) => void
  setPlayerTwoName: (name: string) => void
  setIsNameModalOpen: (isOpen: boolean) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<number[][]>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLUMNS).fill(EMPTY)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<number>(PLAYER)
  const [winner, setWinner] = useState<number | null>(null)
  const [isDraw, setIsDraw] = useState<boolean>(false)
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING)
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM)
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.VS_AI)
  const [playerOneName, setPlayerOneName] = useState<string>("Player 1")
  const [playerTwoName, setPlayerTwoName] = useState<string>("Player 2")
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(true)

  // Update player two name when game mode changes
  useEffect(() => {
    if (gameMode === GameMode.VS_AI) {
      setPlayerTwoName("AI")
    } else if (playerTwoName === "AI") {
      setPlayerTwoName("Player 2")
    }
  }, [gameMode, playerTwoName])

  // Check for winner or draw
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return

    const winResult = checkWinner(board)
    if (winResult) {
      setWinner(winResult)
      setGameState(GameState.GAME_OVER)
      return
    }

    // Check for draw
    const isDraw = board.every((row) => row.every((cell) => cell !== EMPTY))
    if (isDraw) {
      setIsDraw(true)
      setGameState(GameState.GAME_OVER)
      return
    }

    // AI's turn
    if (currentPlayer === AI && gameState === GameState.PLAYING && gameMode === GameMode.VS_AI) {
      const aiMoveTimeout = setTimeout(() => {
        const aiColumn = getAIMove(board, difficulty)
        if (aiColumn !== -1) {
          const newBoard = makeMove(board, aiColumn, AI)
          if (newBoard) {
            setBoard(newBoard)
          }
          setCurrentPlayer(PLAYER)
        }
      }, 500) // Small delay for better UX

      return () => clearTimeout(aiMoveTimeout)
    }
  }, [board, currentPlayer, gameState, difficulty, gameMode])

  const dropDisc = (column: number) => {
    if (gameState !== GameState.PLAYING) return

    // In VS_AI mode, only allow player to make moves when it's their turn
    if (gameMode === GameMode.VS_AI && currentPlayer !== PLAYER) return

    const newBoard = makeMove(board, column, currentPlayer)
    if (newBoard) {
      setBoard(newBoard)
      // In VS_FRIEND mode, toggle between players
      setCurrentPlayer(currentPlayer === PLAYER ? AI : PLAYER)
    }
  }

  const resetGame = () => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLUMNS).fill(EMPTY)),
    )
    setCurrentPlayer(PLAYER)
    setWinner(null)
    setIsDraw(false)
    setGameState(GameState.PLAYING)
    setIsNameModalOpen(true)
  }

  const value = {
    gameState,
    board,
    currentPlayer,
    winner,
    isDraw,
    difficulty,
    gameMode,
    playerOneName,
    playerTwoName,
    isNameModalOpen,
    dropDisc,
    resetGame,
    setDifficulty,
    setGameMode,
    setPlayerOneName,
    setPlayerTwoName,
    setIsNameModalOpen,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

