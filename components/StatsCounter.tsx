'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
}

function StatItem({ value, label, suffix = '' }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString() + suffix;
      }
    });
    return unsubscribe;
  }, [springValue, suffix]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div
        ref={ref}
        className="text-5xl md:text-6xl font-bold text-blue-600 mb-2"
      >
        0{suffix}
      </div>
      <div className="text-slate-600 font-medium text-lg">{label}</div>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Notre Excellence en Chiffres
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Des années d&apos;expérience et des projets réussis qui témoignent de notre engagement
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          <StatItem value={16} label="Années d'expérience" suffix="+" />
          <StatItem value={5} label="Projets" />
          <StatItem value={33} label="Appartements" suffix="+" />
          <StatItem value={40} label="Clients satisfaits" suffix="+" />
          <StatItem value={5} label="Partenaires" />
        </div>
      </div>
    </section>
  );
}
