"use client"

import { useGame } from "./game-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Difficulty, GameState, PLAYER, GameMode } from "@/lib/constants"
import { RefreshCw, Trophy, AlertCircle, Edit } from "lucide-react"

export function GameControls() {
  const {
    gameState,
    currentPlayer,
    winner,
    isDraw,
    difficulty,
    gameMode,
    playerOneName,
    playerTwoName,
    setDifficulty,
    setGameMode,
    resetGame,
    setIsNameModalOpen,
  } = useGame()

  const handleEditNames = () => {
    setIsNameModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Game Status</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleEditNames} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Names</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2" />
                <span className="font-medium">{playerOneName}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />
                <span className="font-medium">{playerTwoName}</span>
              </div>
            </div>
          </div>

          {gameState === GameState.PLAYING && (
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
              <div className={`w-6 h-6 rounded-full ${currentPlayer === PLAYER ? "bg-red-500" : "bg-yellow-400"}`} />
              <span className="font-medium">
                {currentPlayer === PLAYER ? `${playerOneName}'s turn` : `${playerTwoName}'s turn`}
              </span>
            </div>
          )}

          {gameState === GameState.GAME_OVER && winner !== null && (
            <div className="flex items-center space-x-2 text-green-600 mt-3 pt-3 border-t">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">
                {winner === PLAYER ? `${playerOneName} won!` : `${playerTwoName} won!`}
              </span>
            </div>
          )}

          {gameState === GameState.GAME_OVER && isDraw && (
            <div className="flex items-center space-x-2 text-orange-500 mt-3 pt-3 border-t">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Game ended in a draw!</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Game Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={gameMode}
            onValueChange={(value) => {
              setGameMode(value as GameMode)
              setIsNameModalOpen(true)
            }}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={GameMode.VS_AI} id="vs-ai" />
              <Label htmlFor="vs-ai">Play vs AI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={GameMode.VS_FRIEND} id="vs-friend" />
              <Label htmlFor="vs-friend">Play with Friend</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {gameMode === GameMode.VS_AI && (
        <Card>
          <CardHeader>
            <CardTitle>AI Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={difficulty.toString()}
              onValueChange={(value) => setDifficulty(Number.parseInt(value))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Difficulty.EASY.toString()} id="easy" />
                <Label htmlFor="easy">Easy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Difficulty.MEDIUM.toString()} id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Difficulty.HARD.toString()} id="hard" />
                <Label htmlFor="hard">Hard</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <Button onClick={resetGame} className="w-full" variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        New Game
      </Button>
    </div>
  )
}

