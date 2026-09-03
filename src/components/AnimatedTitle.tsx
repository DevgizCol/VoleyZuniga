"use client";

import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 * i },
  }),
};

const child = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 100,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

interface AnimatedTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function AnimatedTitle({ text, className, delay = 1 }: AnimatedTitleProps) {
  const words = text.split(" ");

  return (
    <motion.h1
      className={`overflow-hidden flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
