import React from 'react'
import ReactDOM from 'react-dom/client'
import QuantoFica from '../quantofica.jsx'
import MoveBrasilBlog from '../movebrasil-blog.jsx'

function App() {
  const path = window.location.pathname
    if (path === '/move-brasil' || path === '/movebrasil-blog') {
        return <MoveBrasilBlog />
          }
            return <QuantoFica />
            }

            ReactDOM.createRoot(document.getElementById('root')).render(
              <React.StrictMode>
                  <App />
                    </React.StrictMode>
                    )
