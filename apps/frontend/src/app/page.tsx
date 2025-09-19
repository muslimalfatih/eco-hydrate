'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const headlineVariant = searchParams?.get('headline') === 'b' ? 'b' : 'a';

  const headlines = {
    a: "Eco-Friendly Water Bottle For a Greener Tomorrow",
    b: "Hydrate Better. Save the Planet."
  };

  return (
    <main>
      <motion.section 
        className="hero min-h-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold text-center">
          {headlines[headlineVariant]}
        </h1>
        <p className="text-xl text-center mt-6">
          Join the sustainable revolution with our premium eco-friendly water bottle
        </p>
      </motion.section>
    </main>
  );
}
