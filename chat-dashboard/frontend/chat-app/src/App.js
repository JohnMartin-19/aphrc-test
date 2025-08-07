import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import ChatDashboard from './ChatDashboard';
import './App.css'; // or App.scss if you're using scss for the main app

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <ChatDashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;