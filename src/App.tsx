import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './routes';

const App = () => {
  return (
    <Routes>
      {
        routes.map(item => (
          <Route path={item.path} element={<item.element />} key={item.path} />
        ))
      }
    </Routes>
  )
}

export default App;