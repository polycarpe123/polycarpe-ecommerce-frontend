import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Types
interface HeroSlide {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
}

// Data
const slides: HeroSlide[] = [
  {
    eyebrow: "New Collections 2019",
    title: "MEN'S FASHION",
    copy: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor!",
    image: "https://i.pinimg.com/1200x/32/5b/f0/325bf01cc35e1852870cef2f6ad5e35c.jpg",
  },
  {
    eyebrow: "Summer Collection 2019",
    title: "WOMEN'S STYLE",
    copy: "Discover the latest trends in women's fashion with exclusive deals up to 50% off!",
    image: "https://picsum.photos/900/900?random=41",
  },
  {
    eyebrow: "Kids Fashion 2019",
    title: "KIDS COLLECTION",
    copy: "Comfortable and stylish clothing for your little ones. Shop the best quality!",
    image: "https://picsum.photos/900/900?random=42",
  },
];

// Hero Section Container
const HeroSection = ({ children }: { children: React.ReactNode }) => (
  <section className="bg-white py-8">
    {children}
  </section>
);

// Container Component
const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-7xl mx-auto px-4">
    {children}
  </div>
);

// Hero Grid Layout
const HeroGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

// Main Panel Component
const MainPanel = ({ children }: { children: React.ReactNode }) => (
  <div className="lg:col-span-2 relative rounded-lg overflow-hidden">
    {children}
  </div>
);

// Main Image Component
const MainImage = ({ src, alt, isAnimating }: { src: string; alt: string; isAnimating: boolean }) => (
  <img
    src={src}
    alt={alt}
    className={`w-full h-[500px] object-cover transition-opacity duration-300 ${
      isAnimating ? "opacity-100" : "opacity-75"
    }`}
  />
);

// Main Text Overlay Component
const MainText = ({ children, isAnimating }: { children: React.ReactNode; isAnimating: boolean }) => (
  <div
    className={`absolute inset-0 flex flex-col justify-center items-start p-12 text-white transition-all duration-300 ${
      isAnimating ? "opacity-100 translate-x-0" : "opacity-75 translate-x-4"
    }`}
  >
    {children}
  </div>
);

// Eyebrow Component
const Eyebrow = ({ children, isAnimating }: { children: React.ReactNode; isAnimating: boolean }) => (
  <span
    className={`text-sm uppercase tracking-wider font-semibold mb-3 transition-all duration-300 ${
      isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
    }`}
    style={{ transitionDelay: isAnimating ? "100ms" : "0ms" }}
  >
    {children}
  </span>
);

// Title Component
const Title = ({ children, isAnimating }: { children: React.ReactNode; isAnimating: boolean }) => (
  <h2
    className={`text-5xl font-bold leading-tight mb-4 transition-all duration-300 ${
      isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
    }`}
    style={{ transitionDelay: isAnimating ? "200ms" : "0ms" }}
  >
    {children}
  </h2>
);

// Copy Component
const Copy = ({ children, isAnimating }: { children: React.ReactNode; isAnimating: boolean }) => (
  <p
    className={`text-lg leading-relaxed max-w-lg mb-8 transition-all duration-300 ${
      isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
    }`}
    style={{ transitionDelay: isAnimating ? "300ms" : "0ms" }}
  >
    {children}
  </p>
);

// CTA Button Component
const CTAButton = ({ children, isAnimating }: { children: React.ReactNode; isAnimating: boolean }) => (
  <button
    className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 ${
      isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
    }`}
    style={{ transitionDelay: isAnimating ? "400ms" : "0ms" }}
  >
    {children}
  </button>
);

// Navigation Button Component
const NavButton = ({ onClick, children, position, ariaLabel }: { 
  onClick: () => void; 
  children: React.ReactNode; 
  position: "left" | "right"; 
  ariaLabel: string;
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`absolute ${position === "left" ? "left-6" : "right-6"} top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-all hover:scale-105`}
  >
    {children}
  </button>
);

// Promo Column Component
const PromoColumn = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-6">
    {children}
  </div>
);

// Promo Card Component
const PromoCard = ({ children }: { children: React.ReactNode }) => (
  <div className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:transform hover:-translate-y-1">
    {children}
  </div>
);

// Promo Text Component
const PromoText = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">
    {children}
  </div>
);

// Promo Eyebrow Component
const PromoEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-2">
    {children}
  </div>
);

// Promo Title Component
const PromoTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl font-bold text-gray-900 mb-1">
    {children}
  </h3>
);

// Promo Subtitle Component
const PromoSubtitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-600 mb-4">
    {children}
  </p>
);

// Promo Button Component
const PromoButton = ({ children }: { children: React.ReactNode }) => (
  <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-lg font-medium text-sm transition-all">
    {children}
  </button>
);

// Product Image Component
const ProductImage = ({ src, alt }: { src: string; alt: string }) => (
  <img
    src={src}
    alt={alt}
    className="w-full h-48 object-cover"
  />
);

// Main Component
const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const handlePrev = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsAnimating(true);
    }, 50);
  };

  const handleNext = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setIsAnimating(true);
    }, 50);
  };

  const current = slides[currentSlide];

  return (
    <HeroSection>
      <Container>
        <HeroGrid>
          <MainPanel>
            <NavButton
              onClick={handlePrev}
              position="left"
              ariaLabel="Previous slide"
            >
              <ChevronLeft size={24} />
            </NavButton>
            <NavButton
              onClick={handleNext}
              position="right"
              ariaLabel="Next slide"
            >
              <ChevronRight size={24} />
            </NavButton>

            <MainImage
              src={current.image}
              alt={current.title}
              isAnimating={isAnimating}
            />
            <MainText isAnimating={isAnimating}>
              <Eyebrow isAnimating={isAnimating}>{current.eyebrow}</Eyebrow>
              <Title isAnimating={isAnimating}>{current.title}</Title>
              <Copy isAnimating={isAnimating}>{current.copy}</Copy>
              <CTAButton isAnimating={isAnimating}>Shop Now</CTAButton>
            </MainText>
          </MainPanel>

          <PromoColumn>
            <PromoCard>
              <PromoText>
                <PromoEyebrow>WHITE SNEAKERS</PromoEyebrow>
                <PromoTitle>MIN. 30% OFF</PromoTitle>
                <PromoSubtitle>Men Fashionable Shoes</PromoSubtitle>
                <PromoButton>Shop Now</PromoButton>
              </PromoText>
              <ProductImage
                src="https://picsum.photos/600/400?random=92"
                alt="White sneakers"
              />
            </PromoCard>

            <PromoCard>
              <PromoText>
                <PromoEyebrow>VINTAGE BAGS</PromoEyebrow>
                <PromoTitle>UP TO 65% OFF</PromoTitle>
                <PromoSubtitle>Shoes & Backpacks</PromoSubtitle>
                <PromoButton>Shop Now</PromoButton>
              </PromoText>
              <ProductImage
                src="https://picsum.photos/600/400?random=93"
                alt="Women bags"
              />
            </PromoCard>
          </PromoColumn>
        </HeroGrid>
      </Container>
    </HeroSection>
  );
};

export default HeroBanner;
