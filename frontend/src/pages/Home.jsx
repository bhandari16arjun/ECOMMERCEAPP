import BestSeller from "../components/BestSeller"
import Hero from "../components/Hero"
import LatestCollection from "../components/LatestCollection"
import NewsletterBox from "../components/NewsletterBox"
import OurPolicy from "../components/OurPolicy"
import Footer from "../components/Footer"

export default function Home(){
    return (
      <div>
           <Hero></Hero>
           <LatestCollection/>
           <BestSeller/>
           <OurPolicy/>
           <NewsletterBox/>
           <Footer/>
      </div>  
    )
}