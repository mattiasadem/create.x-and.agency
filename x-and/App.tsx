import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustBadges from './components/TrustBadges';
import FeaturesGrid from './components/FeaturesGrid';
import ScaleSection from './components/ScaleSection';
import RolesSection from './components/RolesSection';
import CommunitySection from './components/CommunitySection';
import FooterCTA from './components/FooterCTA';
import Footer from './components/Footer';
import BuilderLayout from './components/builder/BuilderLayout';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'builder'>('landing');
  const [initialPrompt, setInitialPrompt] = useState('');

  const handleStartBuild = (prompt: string) => {
    setInitialPrompt(prompt);
    setView('builder');
    // Scroll to top when switching views
    window.scrollTo(0, 0);
  };

  if (view === 'builder') {
    return <BuilderLayout initialPrompt={initialPrompt} onBack={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      <Header />
      <main>
        <Hero onStartBuild={handleStartBuild} />
        <TrustBadges />
        <FeaturesGrid />
        <ScaleSection />
        <RolesSection />
        <CommunitySection />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;