import { createFileRoute } from '@tanstack/react-router'
import { Booking } from '@/components/home/Booking'
import { BrandStory } from '@/components/home/BrandStory'
import { ChooseExperience } from '@/components/home/ChooseExperience'
import { CityTours } from '@/components/home/CityTours'
import { CompanyProfile } from '@/components/home/CompanyProfile'
import { Contact } from '@/components/home/Contact'
import { Culinary } from '@/components/home/Culinary'
import { Destinations } from '@/components/home/Destinations'
import { Gallery } from '@/components/home/Gallery'
import { Hero } from '@/components/home/Hero'
import { ItineraryBuilder } from '@/components/home/ItineraryBuilder'
import { Packages } from '@/components/home/Packages'
import { TeamGuides } from '@/components/home/TeamGuides'
import { Testimonials } from '@/components/home/Testimonials'
import { TravelGuide } from '@/components/home/TravelGuide'
import { WhyGarut } from '@/components/home/WhyGarut'
import { ScrollToBottomFab } from '@/components/home/ScrollToBottomFab'
import { useSiteSettings } from '@/lib/siteSettings'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { settings } = useSiteSettings()

  return (
    <>
      <Hero />
      {settings.showWhyGarut !== false && <WhyGarut />}
      {settings.showDestinations !== false && <Destinations />}
      {settings.showCityTours !== false && <CityTours />}
      {Boolean(settings.showExperience) && <ChooseExperience />}
      {settings.showCulinary !== false && <Culinary />}
      {Boolean(settings.showItinerary) && <ItineraryBuilder />}
      {settings.showPackages !== false && <Packages />}
      {settings.showGallery !== false && <Gallery />}
      {Boolean(settings.showTeam) && <TeamGuides />}
      {settings.showCompanyProfile !== false && <CompanyProfile />}
      {Boolean(settings.showBrandStory) && <BrandStory />}
      {settings.showTestimonials !== false && <Testimonials />}
      {settings.showTravelGuide !== false && <TravelGuide />}
      {settings.showBookingBanner !== false && <Booking />}
      {settings.showContact !== false && <Contact />}
      <ScrollToBottomFab />
    </>
  )
}
