// components/Hero/Hero.view.tsx

import React from 'react';

// HeroView가 받을 props 타입 정의
interface HeroViewProps {
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function HeroView({ email, onEmailChange, onSubmit }: HeroViewProps) {
  return (
    <section className="bg-[#FBFBFA] py-20 sm:py-28">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        
        {/* Main Headline */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Powerful banking.
          <br />
          Simplified finances.
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Apply in 10 minutes for online business banking¹ that transforms how you operate.
        </p>

        {/* Call-to-Action Form */}
        <form
          onSubmit={onSubmit}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Enter your email"
            required
            className="w-full rounded-md border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-auto sm:min-w-[280px]"
          />
          <button
            type="submit"
            className="w-full whitespace-nowrap rounded-md bg-[#6A59FF] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5848d8] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Open Account
          </button>
          <button
            type="button"
            className="w-full whitespace-nowrap rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Explore Demo
          </button>
        </form>

      </div>

      {/* Product Dashboard Image */}
      <div className="container mx-auto mt-16 max-w-6xl px-6 sm:mt-24">
        {/* 실제 이미지 경로로 교체해주세요. 
          next/image 또는 <img> 태그를 사용할 수 있습니다.
        */}
        <img
          src="https://i.imgur.com/2A5IKbN.png" // Placeholder image URL, replace with your actual image path
          alt="Product dashboard preview"
          className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
        />
      </div>
    </section>
  );
}