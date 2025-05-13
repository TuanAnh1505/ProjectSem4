import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/VietnamTourism/index';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PlacesToGo from './components/PlaceToGo/PlaceToGo';
import ThingsToDo from './components/ThingToDo/ThingsToDo';
// import các component khác nếu có

// Layout component that wraps all pages with Header and Footer
const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        {/* Add more routes here as needed */}
        <Route path="/live-fully" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/places-to-go" element={
          <Layout>
            <PlacesToGo />
          </Layout>
        } />
        <Route path="/things-to-do" element={
          <Layout>
            <ThingsToDo />
          </Layout>
        } />
        <Route path="/plan" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/offers" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/green-travel" element={
          <Layout>
            <Home />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;