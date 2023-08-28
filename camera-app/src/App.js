import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import './App.css'
import Profile from './components/Profile';
import WebcamCapture from './components/Profile';
export default function App() {
  return (
    <div className="container mt-5">
      <WebcamCapture />
    </div>
  )
}