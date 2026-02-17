"use client";

import AudioPlayer from "@/components/AudioPlayer";
import Hero from "@/components/Hero";
import Body from "@/components/Body";
import Date from "@/components/Date";
import Ubication from "@/components/Ubication";
import Banner from "@/components/Banner";
import Images from "@/components/Images";
import SecondBanner from "@/components/SecondBanner";
import Info from "@/components/Info";
import Form from "@/components/Form";
import Footer from "@/components/Footer";

import { motion } from "motion/react";

export default function Home() {
  const components = [
    { Component: Body, key: "body" },
    { Component: Date, key: "date" },
    { Component: Ubication, key: "ubication" },
    { Component: Banner, key: "banner" },
    { Component: Images, key: "images" },
    { Component: SecondBanner, key: "secondbanner" },
    { Component: Info, key: "info" },
    { Component: Form, key: "form" },
  ];

  return (
    <>
      <Hero />
      <AudioPlayer />
      {components.map(({ Component, key }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        >
          <Component />
        </motion.div>
      ))}
      <Footer />
    </>
  );
}
