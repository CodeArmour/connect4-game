"use client"

import { useState, useEffect } from "react"
import { useGame } from "./game-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { GameMode } from "@/lib/constants"

export function NameModal() {
  const {
    isNameModalOpen,
    setIsNameModalOpen,
    gameMode,
    playerOneName,
    playerTwoName,
    setPlayerOneName,
    setPlayerTwoName,
  } = useGame()

  const [tempPlayerOneName, setTempPlayerOneName] = useState(playerOneName)
  const [tempPlayerTwoName, setTempPlayerTwoName] = useState(playerTwoName)

  // Update temp names when the actual names change
  useEffect(() => {
    setTempPlayerOneName(playerOneName)
    setTempPlayerTwoName(playerTwoName)
  }, [playerOneName, playerTwoName])

  const handleSubmit = () => {
    // Use default names if fields are empty
    setPlayerOneName(tempPlayerOneName.trim() || "Player 1")

    if (gameMode === GameMode.VS_FRIEND) {
      setPlayerTwoName(tempPlayerTwoName.trim() || "Player 2")
    } else {
      setPlayerTwoName("AI")
    }

    setIsNameModalOpen(false)
  }

  return (
    <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Player Names</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="player-one">Player 1 (Red)</Label>
            <Input
              id="player-one"
              value={tempPlayerOneName}
              onChange={(e) => setTempPlayerOneName(e.target.value)}
              placeholder="Enter your name"
              maxLength={15}
            />
          </div>

          {gameMode === GameMode.VS_FRIEND && (
            <div className="space-y-2">
              <Label htmlFor="player-two">Player 2 (Yellow)</Label>
              <Input
                id="player-two"
                value={tempPlayerTwoName}
                onChange={(e) => setTempPlayerTwoName(e.target.value)}
                placeholder="Enter your friend's name"
                maxLength={15}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Start Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

