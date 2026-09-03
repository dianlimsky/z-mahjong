import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Leaderboard } from './pages/Leaderboard'
import { Players } from './pages/Players'
import { History } from './pages/History'
import { NewGame } from './pages/NewGame'
import { DeclareWinner } from './pages/DeclareWinner'
import { PlayerDetail } from './pages/PlayerDetail'

export default function App() {
  return <BrowserRouter><AppProvider><Routes><Route element={<Layout />}><Route path="/" element={<Home />} /><Route path="/leaderboard" element={<Leaderboard />} /><Route path="/players" element={<Players />} /><Route path="/players/:id" element={<PlayerDetail />} /><Route path="/history" element={<History />} /><Route path="/new-game" element={<NewGame />} /><Route path="/declare-winner/:gameId" element={<DeclareWinner />} /></Route></Routes></AppProvider></BrowserRouter>
}
