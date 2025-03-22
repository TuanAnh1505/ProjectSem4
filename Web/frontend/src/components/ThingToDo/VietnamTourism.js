import React from "react";
import styles from "./VietnamTourism.module.css";
import Header from "./Header";
import HeroSection from "./HeroSection";
import GetInspired from "./GetInspired";
import ContentSection from "./ContentSection";
import FestivalsSection from "./FestivalsSection";
import Footer from "./Footer";

const VietnamTourism = () => {
  const sections = [
    {
      title: "Fabulous Food",
      description:
        "If there's one characteristic that unites Vietnamese food, it's freshness. Pass by any Vietnamese market, you'll be amazed by the abundance of the sea and soil: feathery herbs, plump vegetables and flapping-fresh proteins. Freshness is where the fun begins. Vietnamese cooks enhance beautiful ingredients with aromatic herbs and contrasting textures for maximum delight. Simply put, it's one of the world's healthiest and most delicious cuisines.",
      articles: [
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/01321e7f49f319e06ba82865ea8988792aefa05c",
          title:
            "Local unpacked: One of a kind cuisine of Ha Giang karst plateau",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/48b43a734882498b43da6e4a65c4b5c31e7614d8",
          title: "Explore delicious dishes in Ho Chi Minh City",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/0100eacd4b11feca2ab05bfe89d30b8546fb4975",
          title: "Ha Noi Food Guide: The best street food dishes to sample",
        },
      ],
    },
    {
      title: "striking scenery",
      description:
        "Vietnam is chock-full of forested peaks, thundering waterfalls, and breezy coastline, so it's no wonder the country is luring more and more outdoor enthusiasts. With so many options at your fingertips, you may need a second (or third) trip to take it all in. And while there are plenty of pulse-pounding activities, Vietnam also presents more leisurely ways to enjoy its vast natural attractions.",
      articles: [
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/caae94355d5075c82fd4251ddd94e1dc496773a7",
          title: 'Persimmons Garden - "Green" travel spots in Da Lat',
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/bd6a804b4ea672c8f8e412ce891a53c8ad766585",
          title: "Vietnam - The nature wonder of Asia",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/95754b30966e2e2dd4e6344b0541558b78d14998",
          title: "Go green in Co To",
        },
      ],
    },
    {
      title: "timeless culture",
      description:
        "In a country like Vietnam, the word 'culture' has a thousand meanings. It might mean the red and gold gilded doors of the Hue Citadel, or the tin-filter drip coffee served on every street corner. It might mean the sensitive watercolours hanging in a contemporary gallery, or the throaty cry of Ca Trù sung poetry. It could even encompass the embroidered costumes of the Flower Hmong, or the subtle lines of the áo dài. Past and present, hand-in-hand, are what makes Vietnamese culture so compelling.",
      articles: [
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/655e5f7695c381436dc2373d1128178cf53cbfc2",
          title:
            "[Infographic] Visa exemption for citizens of Poland, Czech and Switzerland",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/9c5a0a1d09a9ed8b0ca6c643347913bbb1f6fe38",
          title:
            "Tea Factory 1927: the living witness to the development of Vietnam's tea industry",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/2efed946e11839fbb9c011836b5a9e3570a91fdc",
          title: "Wander the ancient traditional silk villages of Vietnam",
        },
      ],
    },
    {
      title: "changing cities",
      description:
        "Spend a few days in its urban centres, and you'll see why so many travellers are taken with Vietnam's captivating energy. In the streets and you'll encounter chaotic markets and colonial-era cafes, sparkling malls, hip rooftop lounges, and tidy boutiques. At least once in your stay, do as the locals do and enjoy an evening of barbecue and beer on the sidewalk, or chat over a cup of tea in the shade of a city park.",
      articles: [
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/6d429cd8253779bedc9c5bf32c1c5038aa38ce3f",
          title: "10 Tourist spots not to be missed in Ho Chi Minh City",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/3182dcfb86b70d3cace50a096d7824dea951a657",
          title:
            "Enjoy bus rides back and forth between T1 and T2 Noi Bai International Airport free of charge!",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/545def150931e66af7bd4e1ed2bbe7c360981496",
          title: "4 Reasons Why Da Nang is Vietnam's Most Livable City",
        },
      ],
    },
    {
      title: "blissful beaches",
      description:
        "Vietnam is a country with a long, curving coastline. Scattered offshore are dozens of beautiful islets, teeming with sea life and blessed with pristine shores. Vietnam's coastal cities are packed with activities and on-the-water adventures, while its fishing villages still hold their simple, seaside charms. Wherever you choose, chilled coconuts, basket boats, and seafood dinners are guaranteed.",
      articles: [
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/33bbbeb16f294caef150986691f6595a031a4639",
          title: "Phu Quoc Island: A Laid back, Leisure Getaway",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/8402178d00d1a35579ce43cb37920824c3c44f92",
          title:
            "Nature, Culture, and Adventure on Vietnam's Top 5 Beach Islands",
        },
        {
          image:
            "https://cdn.builder.io/api/v1/image/assets/TEMP/f7a1fbd648e7b587b09a940dd432c1dfbe63f1b3",
          title: "Sunset in Phu Quoc",
        },
      ],
    },
  ];

  return (
    <div className={styles.div}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap"
      />
      <Header />
      <HeroSection />
      <GetInspired />
      {sections.map((section, index) => (
        <ContentSection
          key={index}
          title={section.title}
          description={section.description}
          articles={section.articles}
        />
      ))}
      <FestivalsSection />
      <Footer />
    </div>
  );
};

export default VietnamTourism;
