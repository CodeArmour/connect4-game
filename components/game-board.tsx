"use client"

import { useGame } from "./game-provider"
import { COLUMNS, EMPTY, PLAYER } from "@/lib/constants"
import { motion } from "framer-motion"
import { GameMode } from "@/lib/types"

export function GameBoard() {
  const { board, dropDisc, currentPlayer, gameState, gameMode } = useGame()

  return (
    <div className="bg-blue-600 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-7 gap-2">
        {Array(COLUMNS)
          .fill(null)
          .map((_, colIndex) => (
            <button
              key={`drop-${colIndex}`}
              onClick={() => dropDisc(colIndex)}
              disabled={gameState !== "PLAYING" || (gameMode === GameMode.VS_AI && currentPlayer !== PLAYER)}
              className="h-10 bg-blue-500 hover:bg-blue-400 rounded-t-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Drop disc in column ${colIndex + 1}`}
            />
          ))}
      </div>

      <div className="grid grid-cols-7 gap-2 bg-blue-600 p-2 rounded-b-lg">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="aspect-square bg-blue-700 rounded-full p-1">
              {cell !== EMPTY && (
                <motion.div
                  initial={{ y: -100 * (rowIndex + 1), opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.05 * rowIndex }}
                  className={`w-full h-full rounded-full ${cell === PLAYER ? "bg-red-500" : "bg-yellow-400"}`}
                />
              )}
              {cell === EMPTY && <div className="w-full h-full rounded-full bg-white opacity-10" />}
            </div>
          )),
        )}
      </div>
    </div>
  )
}

