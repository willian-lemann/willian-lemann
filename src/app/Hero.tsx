"use client";

import Image from "next/image";

import { Social } from "@/components/Social";

type HeroProps = {
  title: string;
  description: string;
  actionLabel: string;
};

export function Hero({ title, description }: HeroProps) {
  return (
    <section>
      <div className="text-start py-10 flex flex-col">
        <div className="relative h-20 w-20 rounded-full">
          <Image
            src="/avatar.jpeg"
            alt="avatar image"
            fill
            className="object-cover rounded-full"
          />
        </div>

        <h3 className="text-2xl pt-4 dark:text-white text-zinc-600 md:text-3xl max-w-xl">
          {title}
        </h3>

        <p className="text-md pt-4 leading-8 text-gray-800 dark:text-gray-200 max-w-xl md:text-xl">
          {description}
        </p>

        <Social />
      </div>
    </section>
  );
}
