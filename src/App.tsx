import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { RoutesApp } from './routes'

export const App: React.FC = () => {

  return (
    <BrowserRouter 
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }
    }>
      <RoutesApp />
    </BrowserRouter>
  )
}

