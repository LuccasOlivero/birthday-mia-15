import Hero from "@/components/Hero";
import Body from "@/components/Body";
import Date from "@/components/Date";
import Ubication from "@/components/Ubication";
import Banner from "@/components/Banner";
import Images from "@/components/Images";
import SecondBanner from "@/components/SecondBanner";
import Form from "@/components/Form";
import Info from "@/components/Info";
import Footer from "@/components/Footer";

export default function Home() {
  // cancion de fondo
  // https://www.youtube.com/watch?v=QYaPhMmsZ1g&list=RDQYaPhMmsZ1g&start_radio=1
  return (
    <>
      <Hero />
      <Body />
      <Date />
      <Ubication />
      <Banner />
      <Images />
      <SecondBanner />
      <Info />
      <Form />
      <Footer />
    </>
  );
}
