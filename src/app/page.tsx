"use client"

import dynamic from 'next/dynamic';

const ScrollAnimation = dynamic(() => import('../components/ScrollAnimation'), {
  ssr: false,
})

export default function Home() {
  return (
    <main>
      <ScrollAnimation />
    </main>
  );
}
