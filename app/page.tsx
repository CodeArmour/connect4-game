import { GameBoard } from "@/components/game-board"
import { GameControls } from "@/components/game-controls"
import { GameProvider } from "@/components/game-provider"
import {NameModal} from "@/components/name-modal"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Connect 4</h1>
          <p className="text-gray-600">Connect four of your discs in a row to win!</p>
        </div>

        <GameProvider>
          <NameModal />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <GameBoard />
            </div>
            <div className="md:col-span-1">
              <GameControls />
            </div>
          </div>
        </GameProvider>
      </div>
    </main>
  )
}

